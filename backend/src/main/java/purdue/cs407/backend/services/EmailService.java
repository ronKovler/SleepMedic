package purdue.cs407.backend.services;

import jakarta.mail.*;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import purdue.cs407.backend.controllers.NotificationController;
import purdue.cs407.backend.pojos.EmailDetails;
import purdue.cs407.backend.repositories.ReminderRepository;

import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;

import static java.util.Map.entry;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final Session javaReadSession;
    private final ResourceLoader resourceLoader = new DefaultResourceLoader();

    /** <a href="https://en.wikipedia.org/wiki/SMS_gateway">...</a>*/
    private final Map<String, String> carrierGatewayMap = Map.ofEntries(
            entry("Verizon", "@vtext.com"),
            entry("T-Mobile", "@tmomail.net"),
            entry("AT&T", "@txt.att.net"),
            entry("Google Fi Wireless", "@msg.fi.google.com"),
            entry("XFinity Mobile", "@vtext.com"),
            entry("Sprint", "@messaging.sprintpcs.com"), // TODO Does sprint still exist???
            entry("U.S. Cellular", "@email.uscc.net"),
            entry("Cricket Wireless", "@mms.cricketwireless.net"),
            entry("Boost Mobile", "@sms.myboostmobile.com"),
            entry("Consumer Cellular", "@mailmymobile.net"),
            entry("MetroPCS", "@mymetropcs.com")
            // TODO add more US and other country carriers.
    );

    public EmailService(JavaMailSender javaMailSender, Session javaReadSession) {
        this.javaMailSender = javaMailSender;
        this.javaReadSession = javaReadSession;
    }


    public String sendSimpleMail(EmailDetails details) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            message.setSubject(details.getSubject());
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("SleepMedic");
            helper.setTo(details.getRecipient());
            helper.setText(details.getMsgBody(), true);

            javaMailSender.send(message);

//            SimpleMailMessage mailMessage = new SimpleMailMessage();
//            String sender = "SleepMedic";
//            mailMessage.setFrom(sender);
//            mailMessage.setTo(details.getRecipient());
//            mailMessage.setText(details.getMsgBody());
//            mailMessage.setSubject(details.getSubject());
//
//            javaMailSender.send(mailMessage);
            return "Success";
        } catch (Exception e) {
            return "Failed to send message";
        }
    }


    public String[] checkAndProcessInbox() {
        try {
            ArrayList<String> cancelRequests = new ArrayList<>();
            Store store = javaReadSession.getStore("imaps");
            store.connect("imap.gmail.com", 993, "sleepmedic.me@gmail.com", "rmnrufeaijzxegcq");

            Folder inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_WRITE);

            Message[] messages = inbox.getMessages();
            for (Message message : messages) {
                String from = Arrays.toString(message.getFrom());
                System.out.println("-----------------FROM: " + from);
                Object content = message.getContent();
                String body = "";
                if (content instanceof String) {
                    body = (String) content;
                } else if(content instanceof MimeMultipart multipart) {

                    StringBuilder temp = new StringBuilder();
                    for (int i = 0; i < multipart.getCount(); i++) {
                        BodyPart bodyPart = multipart.getBodyPart(i);
                        String partContent = bodyPart.getContentType();
                        if (partContent.contains("text/plain") || partContent.contains("text/html")) {
                            temp.append((String) bodyPart.getContent());
                        }
                    }
                    body = temp.toString();
                }
                System.out.println("------------BODY: " + body);


                if (body.startsWith("CANCEL")) {
                    String ID = body.substring(7);
                    ID = ID.replaceAll("\\s","");
                    from = from.replace("\n", "").replace("[", "").replace("]","");
                    String temp = ID + " " + from;
                    System.out.println("----------------------------------------PRINT: " +temp);
                    cancelRequests.add(ID.replace("\n", "") + " " + from.replace("\n", ""));
                }
                message.setFlag(Flags.Flag.DELETED, true);
            }

            inbox.expunge();
            inbox.close();
            store.close();
            return cancelRequests.toArray(new String[0]);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public String getTemplate(int msg) {
        String path = switch (msg) {
            case 1 -> "classpath:BedtimeReminder.html";
            case 2 -> "classpath:SleepHygieneReminder.html";
            case 4 -> "classpath:PasswordReset.html";
            default -> null;
        };

        if (path == null) {
            return null;
        }
        Resource resource = resourceLoader.getResource(path);
        String template = null;
        try {
            template = resource.getContentAsString(StandardCharsets.UTF_8);
        } catch (IOException e) {
            System.out.println("Failed to get resource for reminder template.");
        }
        return template;
    }


    public String getCarrierGateway(String carrier) {
        return carrierGatewayMap.get(carrier);
    }


    public String sendMailWithAttachment(EmailDetails details) {
        return null;
    }




    /* Should execute every SUNDAY (1) at 00:00:00 (0, 0, 0) at any month and any day of week (?, ?) */
//    @Scheduled(cron = "0 0 0 ? ? 1")
//    public void scheduleReminders() {
//        List<Reminder> reminders = reminderRepository.findAll();
//
//        for (Reminder reminder : reminders) {
//            User user = reminder.getUser();
//            StringBuilder daysStr = new StringBuilder(" ");
//            //Leftmost bit - 1 is SUNDAY, rightmost bit is MONDAY. eg Monday & Sunday: 0100 0001
//            byte days = reminder.getTriggerDays();
//            byte mask = (byte) 0b01000000; // Create a bit mask to check individual days. Binary: 0100 0000
//            byte counter = 0;
//            while (mask > 0) {
//                if ((days & mask) != 0) {
//
//                }
//
//                mask = (byte) (mask >> 1); // Right shift to check new day
//            }
//        }
//    }


}

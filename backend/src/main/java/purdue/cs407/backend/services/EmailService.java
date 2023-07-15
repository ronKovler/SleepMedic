package purdue.cs407.backend.services;

import jakarta.mail.*;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.search.FlagTerm;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import purdue.cs407.backend.pojos.EmailDetails;
import java.io.IOException;
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

    /** <a href="https://en.wikipedia.org/wiki/SMS_gateway">Wikipedia US/NA Carrier SMS Gateways</a>*/
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

    /**
     * Send an email to a user specified by EmailDetails
     * @param details user and msg to send.
     * @return String on success/failure (not used currently)
     */
    public String sendSimpleMail(EmailDetails details) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            message.setSubject(details.getSubject());
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom("SleepMedic");
            helper.setTo(details.getRecipient());
            helper.setText(details.getMsgBody(), true);

            javaMailSender.send(message);

            return "Success";
        } catch (Exception e) {
            return "Failed to send message";
        }
    }

    //TODO remove test prints.
    /**
     * Called by scheduled method in homeController to check new emails periodically
     * @return Array of strings containg info about records to be validated then canceled.
     */
    public String[] checkAndProcessInbox() {
        try {
            ArrayList<String> cancelRequests = new ArrayList<>();
            Store store = javaReadSession.getStore("imaps");
            store.connect("imap.gmail.com", 993, "sleepmedic.me@gmail.com", "rmnrufeaijzxegcq");

            Folder inbox = store.getFolder("INBOX");
            inbox.open(Folder.READ_WRITE);

            Message[] messages = inbox.getMessages(); //inbox.search(new FlagTerm(new Flags(Flags.Flag.SEEN), false));
            for (Message message : messages) {
                String from = Arrays.toString(message.getFrom()).replaceAll("\\s","");
                System.out.println("-----------------FROM: " + from);
                Object content = message.getContent();

                // This is necessary to extract body correctly.
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
                System.out.println("BODY: " + body);
                // This is a text cancellation request (supposedly), add to list and delete.
                if (body.startsWith("CANCEL")) {
                    System.out.println("BODY STARTED WITH CANCEL");
                    String ID = body.substring(7).replaceAll("\\s","");
                    ID = ID.replaceAll("\\s","");
                    from = from.replaceAll("\\s", "").replace("[", "").replace("]","");

                    cancelRequests.add(ID.replace("\n", "") + " " + from.replace("\n", ""));
                    message.setFlag(Flags.Flag.DELETED, true); // Mark email for deletion after handling it.
                } else {
                    message.setFlag(Flags.Flag.SEEN, true); // Mark email as seen to prevent loading it again.
                }

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

    /**
     * Get HTML template resource from msg ID
     * @param msg Integer of message type
     * @return String message or null if messageID invalid.
     */
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

    /**
     * Accessor method to get carrier gateway outside this class.
     * @param carrier - String carrier name to match
     * @return String email gateway for that carrier or null if not found
     */
    public String getCarrierGateway(String carrier) {
        return carrierGatewayMap.get(carrier);
    }

    //TODO do we want to send attachments?
    public String sendMailWithAttachment(EmailDetails details) {
        return null;
    }

}

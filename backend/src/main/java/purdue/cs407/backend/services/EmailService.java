package purdue.cs407.backend.services;

import jakarta.mail.internet.MimeMessage;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import purdue.cs407.backend.pojos.EmailDetails;
import purdue.cs407.backend.repositories.ReminderRepository;

import java.io.IOException;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {


    private final JavaMailSender javaMailSender;
    private final ResourceLoader resourceLoader = new DefaultResourceLoader();

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
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

    public String getTemplate(int msg) {
        String path = switch (msg) {
            case 1 -> "classpath:BedtimeReminder.html";
            case 2 -> "classpath:SleepHygieneReminder.html";
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

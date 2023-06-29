package purdue.cs407.backend.services;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import purdue.cs407.backend.pojos.EmailDetails;
import purdue.cs407.backend.repositories.ReminderRepository;

@Service
public class EmailService {


    private final JavaMailSender javaMailSender;

    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public String sendSimpleMail(EmailDetails details) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            String sender = "SleepMedic";
            mailMessage.setFrom(sender);
            mailMessage.setTo(details.getRecipient());
            mailMessage.setText(details.getMsgBody());
            mailMessage.setSubject(details.getSubject());

            javaMailSender.send(mailMessage);
            return "Success";
        } catch (Exception e) {
            return "Failed to send message";
        }
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

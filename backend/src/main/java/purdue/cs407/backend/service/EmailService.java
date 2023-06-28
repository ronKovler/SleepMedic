package purdue.cs407.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import purdue.cs407.backend.pojos.EmailDetails;
import purdue.cs407.backend.models.Reminder;
import purdue.cs407.backend.models.User;
import purdue.cs407.backend.repositories.ReminderRepository;

import java.util.List;

@Service
public class EmailService {


    private final JavaMailSender javaMailSender;
    private final ReminderRepository reminderRepository;
    private final String sender;


    public EmailService(JavaMailSender javaMailSender, ReminderRepository reminderRepository) {
        this.javaMailSender = javaMailSender;
        this.reminderRepository = reminderRepository;
        this.sender = "SleepMedic";
    }

    public String sendSimpleMail(EmailDetails details) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
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
    @Scheduled(cron = "0 0 0 ? ? 1")
    public void scheduleReminders() {
        List<Reminder> reminders = reminderRepository.findAll();

        for (Reminder reminder : reminders) {
            User user = reminder.getUser();

        }
    }
}

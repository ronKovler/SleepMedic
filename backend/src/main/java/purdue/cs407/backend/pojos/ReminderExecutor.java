package purdue.cs407.backend.pojos;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import purdue.cs407.backend.entities.Reminder;
import purdue.cs407.backend.services.EmailService;

import java.util.Base64;

@Service
@Scope("prototype")
public class ReminderExecutor implements Runnable {

    private ReminderTask reminderTask;

    @Autowired
    EmailService emailService;

    @Override
    public void run() {
        System.out.println("SENDING NOTIFICATION");

        String addr = "http://ec2-18-222-211-114.us-east-2.compute.amazonaws.com:8080/api/reminder/cancel_reminder/";
        Reminder reminder = reminderTask.getReminder();
        String template = emailService.getTemplate(reminder.getMessage());
        String hash = Base64.getUrlEncoder().encodeToString(reminder.getJobID().getBytes());
        String message = addr + hash;
        if (template != null) {
            message = template.replace("{FIRST}", reminder.getUser().getFirstName());
            message = message.replace("{LINK}", addr + hash);
        }
        System.out.println(message);
        EmailDetails details = new EmailDetails(reminder.getUser().getEmail(), message, "SleepMedic Notification", null);
        emailService.sendSimpleMail(details);
    }

    public void setReminderTask(ReminderTask reminderTask) {
        this.reminderTask = reminderTask;
    }


}

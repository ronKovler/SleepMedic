package purdue.cs407.backend.pojos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import purdue.cs407.backend.entities.Reminder;
import purdue.cs407.backend.services.EmailService;
import java.util.Base64;

@Service
@Scope("prototype") // Essentially makes this service a "class"
public class ReminderExecutor implements Runnable {

    private ReminderTask reminderTask;

    @Autowired
    EmailService emailService;

    @Override
    public void run() {
        System.out.println("SENDING NOTIFICATION");

        String addr = "http://api.sleepmedic.me:8080/api/reminder/cancel_reminder/";
        Reminder reminder = reminderTask.getReminder();
        String template = emailService.getTemplate(reminder.getMessage());
        String hash = Base64.getUrlEncoder().encodeToString(reminder.getReminderID().toString().getBytes());
        String message = addr + hash;

        if (reminder.getCarrier() != null) {
            // This is a mobile notification, email their carrier instead.
            String firstMessage = switch (reminder.getMessage()) {
                case 1 -> "It's time for bed!\nThis is your SleepMedic reminder to go to sleep.\nFollowing a routine is highly recommended.";
                case 2 -> "This is your SleepMedic reminder.\nStart winding down on electronics and make sure to avoid caffeine and alcohol 6 hours prior to going to sleep!";
                default -> "";
            };
            String recipient = reminder.getUser().getPhone() + emailService.getCarrierGateway(reminder.getCarrier());
            EmailDetails details1 = new EmailDetails(recipient, "", "SM 1/2 " + firstMessage, null);
            emailService.sendSimpleMail(details1);
            EmailDetails details2 = new EmailDetails(recipient, "", "SM 2/2 " + "To cancel, reply: CANCEL " + reminder.getReminderID(), null);
            emailService.sendSimpleMail(details2);
            return;
        }

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

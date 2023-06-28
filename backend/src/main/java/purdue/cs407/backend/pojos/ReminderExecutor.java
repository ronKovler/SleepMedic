package purdue.cs407.backend.pojos;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import purdue.cs407.backend.entities.Reminder;
import purdue.cs407.backend.services.EmailService;

@Service
@Scope("prototype")
public class ReminderExecutor implements Runnable {

    private ReminderTask reminderTask;

    @Autowired
    EmailService emailService;

    @Override
    public void run() {
        System.out.println("SENDING NOTIFICATION");
        Reminder reminder = reminderTask.getReminder();
        String msg = switch (reminder.getMessage()) {
            case 1 -> "Time for bed!";
            case 2 -> "Make sure to put away your distractions as you wind down.";
            default -> "No Message set";
        };
        EmailDetails details = new EmailDetails(reminder.getUser().getEmail(), msg, "SleepMedic Notification", null);
        emailService.sendSimpleMail(details);
    }

    public void setReminderTask(ReminderTask reminderTask) {
        this.reminderTask = reminderTask;
    }
}

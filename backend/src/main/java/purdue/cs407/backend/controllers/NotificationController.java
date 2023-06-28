package purdue.cs407.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import purdue.cs407.backend.dtos.ReminderRequest;
import purdue.cs407.backend.pojos.EmailDetails;
import purdue.cs407.backend.entities.Reminder;
import purdue.cs407.backend.entities.User;
import purdue.cs407.backend.pojos.ReminderExecutor;
import purdue.cs407.backend.pojos.ReminderTask;
import purdue.cs407.backend.repositories.ReminderRepository;
import purdue.cs407.backend.services.EmailService;
import purdue.cs407.backend.services.SchedulingService;

import java.sql.Time;
import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.Locale;

@RestController
@RequestMapping("/api/reminder/")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final ReminderRepository reminderRepository;
    private final EmailService emailService;
    private final SchedulingService schedulingService;

    @Autowired
    ReminderExecutor reminderExecutor;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();;
        return (User) authentication.getPrincipal();
    }

    public NotificationController(ReminderRepository reminderRepository,
                                  EmailService emailService,
                                  SchedulingService schedulingService) {
        this.reminderRepository = reminderRepository;
        this.emailService = emailService;
        this.schedulingService = schedulingService;
    }

    @RequestMapping(value="create_reminder", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createReminder(@RequestBody ReminderRequest request) {
        User user = getCurrentUser();

        // TODO add instrumentation code here for scheduling reminders -- Done
        // TODO add similar code to app startup to restore old reminders
        Reminder reminder = new Reminder(request, user);

        StringBuilder days = new StringBuilder();
        String prefix = "";
        for (DayOfWeek day: request.getTriggerDays()) {
            //Append all days we need in comma seperated string: eg MON-WED: "MON,TUES,WED"
            days.append(prefix);
            prefix = ",";
            days.append(day.getDisplayName(TextStyle.SHORT, Locale.getDefault()).toUpperCase()); // Converts ie DayOfWeek:1 into MON
        }

        String[] time = request.getTriggerTime().toString().split(":");
        int hours = Integer.parseInt(time[0]);
        int minutes = Integer.parseInt(time[1]);

        StringBuilder cron = new StringBuilder("0 ");
        cron.append(minutes).append(" ").append(hours).append(" ? * ").append(days);

        ReminderTask reminderTask = new ReminderTask(cron.toString(), reminder);

        reminderExecutor.setReminderTask(reminderTask);
        schedulingService.scheduleATask(user.getEmail() + (user.getReminders().size() + 1), reminderExecutor, cron.toString());

        user.addReminder(reminder);
        reminderRepository.save(reminder);

        return ResponseEntity.ok("Success");
    }

    @RequestMapping(value="get_reminder", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Reminder> getReminder() {
        User user = getCurrentUser();

        Reminder reminder = new Reminder(user, new Time(System.currentTimeMillis()), 1);

        return ResponseEntity.ok(reminder);
    }

    @RequestMapping(value="send", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> sendMail() {
        //User user = getCurrentUser();
        EmailDetails details = new EmailDetails("kovler.ron@gmail.com", "Test", "Test", null);
        emailService.sendSimpleMail(details);

        return ResponseEntity.ok("sent supposedly");
    }

}

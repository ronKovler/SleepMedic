package purdue.cs407.backend.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import purdue.cs407.backend.dtos.ReminderRequest;
import purdue.cs407.backend.pojos.EmailDetails;
import purdue.cs407.backend.models.Reminder;
import purdue.cs407.backend.models.User;
import purdue.cs407.backend.repositories.ReminderRepository;
import purdue.cs407.backend.service.EmailService;

import java.sql.Time;

@RestController
@RequestMapping("/api/reminder/")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final ReminderRepository reminderRepository;
    private final EmailService emailService;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();;
        return (User) authentication.getPrincipal();
    }

    public NotificationController(ReminderRepository reminderRepository, EmailService emailService) {
        this.reminderRepository = reminderRepository;
        this.emailService = emailService;
    }

    @RequestMapping(value="create_reminder", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createReminder(@RequestBody ReminderRequest request) {
        User user = getCurrentUser();

        // TODO add instrumentation code here for scheduling reminders that need
        // to go off AFTER WEEKLY reminder scheduling chron job happens.
        /*
        What I mean here is once a week, we wil have a scheduled task that gets
        ALL reminders from database and schedule per user as necessary. If this function is triggered and
        the datetime ends up being before the next weekly schedule job, we need to schedule it now instead.
         */
        Reminder reminder = new Reminder(request, user);
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

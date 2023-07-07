package purdue.cs407.backend.controllers;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import purdue.cs407.backend.dtos.ReminderRequest;
import purdue.cs407.backend.pojos.EmailDetails;
import purdue.cs407.backend.entities.Reminder;
import purdue.cs407.backend.entities.User;
import purdue.cs407.backend.pojos.ReminderExecutor;
import purdue.cs407.backend.pojos.ReminderTask;
import purdue.cs407.backend.repositories.ReminderRepository;
import purdue.cs407.backend.repositories.UserRepository;
import purdue.cs407.backend.services.EmailService;
import purdue.cs407.backend.services.SchedulingService;

import java.sql.Time;
import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.Base64;
import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/reminder/")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final ReminderRepository reminderRepository;
    private final EmailService emailService;
    private final SchedulingService schedulingService;
    private final ReminderExecutor reminderExecutor;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();;
        return (User) authentication.getPrincipal();
    }

    public NotificationController(ReminderRepository reminderRepository,
                                  EmailService emailService,
                                  SchedulingService schedulingService, ReminderExecutor reminderExecutor,
                                  UserRepository userRepository) {
        this.reminderRepository = reminderRepository;
        this.emailService = emailService;
        this.schedulingService = schedulingService;
        this.reminderExecutor = reminderExecutor;
        this.userRepository = userRepository;
    }

    public String getCronDayName(byte day) {
        switch (day) {
            case 0, 7 : return "SUN"; //redundant 0
            case 1 : return "MON";
            case 2 : return "TUE";
            case 3 : return "WED";
            case 4 : return "THU";
            case 5 : return "FRI";
            case 6 : return "SAT";
        }
        return null;
    }

    @RequestMapping(value="create_reminder", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createReminder(@RequestBody ReminderRequest request) {
        User user = getCurrentUser();

        // TO-DO add instrumentation code here for scheduling reminders -- Done
        // TODO add similar code to app startup to restore old reminders
        // TODO adjust for users timezone

        StringBuilder days = new StringBuilder();
        String prefix = "";
        byte reminderDaysOfWeek = 0;
        try {
            for (byte day : request.getTriggerDays()) {
                //Append all days we need in comma seperated string: eg MON-WED: "MON,TUES,WED"
                days.append(prefix);
                prefix = ",";
                days.append(getCronDayName(day)); // Converts ie DayOfWeek:1 into MON

                byte mask = 0b00000001;
                mask = (byte) (mask << day); // If day == 0, mask << 0 is a no-op and A-OK. 0 = Sunday (rightmost bit)
                reminderDaysOfWeek = (byte) (reminderDaysOfWeek | mask);

            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build(); // This is because converting day to string can return null
        }

        /* For some reason .getHours() and .getMinutes() is deprecated so String workaround. */
        String[] time = request.getTriggerTime().toString().split(":");
        int hours = Integer.parseInt(time[0]); // Need to remove leading 0s
        int minutes = Integer.parseInt(time[1]); // Need to remove leading 0s

        String cron = "0 " + /* 0 seconds */ minutes + " " + hours + " ? * "/* Month day of month*/ + days;
        String jobID = "reminder_job:" + user.getEmail() + ":";

        Reminder reminder = reminderRepository.save(new Reminder(user, request, reminderDaysOfWeek, cron, jobID));
        reminder.setJobID(jobID + reminder.getReminderID()); //TODO This should be persisted  by jpa automagically but verify it works
        ReminderTask reminderTask = new ReminderTask(cron, reminder);

        reminderExecutor.setReminderTask(reminderTask);
        schedulingService.scheduleATask(reminder.getJobID(), reminderExecutor, cron);

        user.addReminder(reminder);
       // reminderRepository.save(reminder);

        return ResponseEntity.ok("Success");
    }

    @RequestMapping(value="get_reminder", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Reminder> getReminder() {
        User user = getCurrentUser();

        Reminder reminder = new Reminder(user, new Time(System.currentTimeMillis()), 1);

        return ResponseEntity.ok(reminder);
    }

    @RequestMapping(value="cancel_reminder/{hash}", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> cancelReminder(@PathVariable String hash) {
        Base64.Decoder decoder = Base64.getUrlDecoder();
        String[] decrypted = new String(decoder.decode(hash)).split(":"); // Should now be reminder_job:{email}:{reminder_id}
        if (decrypted.length != 3) {
            return ResponseEntity.ok("Error decoding went wrong.");
        }

        User user = userRepository.findByEmail(decrypted[1]).orElseThrow(() -> new UsernameNotFoundException(decrypted[1]));
        Reminder reminder = reminderRepository.findById(Long.parseLong(decrypted[2])).orElseThrow();
        if (reminder.getUser().equals(user)) {
            // Valid delete request
            schedulingService.removeScheduledTask(reminder.getJobID());
            reminderRepository.delete(reminder);

            return ResponseEntity.ok("Reminder Deleted Successfully.\n" +
                    "You can exit out of this tab.");
        }

        return ResponseEntity.badRequest().build();
    }

    @RequestMapping(value="test", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> test() {
        Twilio.init("ACdbe2a10f1104a35c0d19d360cc275022", "abd46cf3f7ca46885f76d82237dc5d80");
        Message.creator(new PhoneNumber("9259970661"), new PhoneNumber("+18443683930"), "Hello From Sleep Medic Spring Boot.").create();

        return ResponseEntity.ok("Ok");
    }

    /**
     * This initializes all previously made reminders before current server boot.
     */
    @PostConstruct
    public void initReminders() {
        List<Reminder> reminders = reminderRepository.findAll();
        for (Reminder reminder : reminders) {
            String jobID = reminder.getJobID();
            String cron = reminder.getCron();

            ReminderTask reminderTask = new ReminderTask(cron, reminder);
            reminderExecutor.setReminderTask(reminderTask);
            schedulingService.scheduleATask(jobID, reminderExecutor, cron);
        }
    }

}

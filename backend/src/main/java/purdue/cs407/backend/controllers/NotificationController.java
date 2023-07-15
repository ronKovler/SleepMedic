package purdue.cs407.backend.controllers;

import jakarta.annotation.PostConstruct;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
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
import java.util.*;


@RestController
@RequestMapping("/reminder/")
@CrossOrigin(origins = "*")
public class NotificationController {

    private final ReminderRepository reminderRepository;
    private final EmailService emailService;
    private final SchedulingService schedulingService;
    private final ReminderExecutor reminderExecutor;
    private final UserRepository userRepository;

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
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

    /**
     * Get the appropriate String day of week representation of a day for CRON job building.
     * @param day - byte day of week
     * @return - String day representation or null if not valid.
     */
    public String getCronDayName(byte day) {
        return switch (day) {
            case 0, 7 -> "SUN"; //redundant 0
            case 1 -> "MON";
            case 2 -> "TUE";
            case 3 -> "WED";
            case 4 -> "THU";
            case 5 -> "FRI";
            case 6 -> "SAT";
            default -> null;
        };
    }

    /**
     * Get the Java timezone name for a given region timezone.
     * @param zone - Int 0 - 4 : PST, MST, CST, EST
     * @return Java timezone name or null if not supported.
     */
    public String getZoneName(int zone) {
        return switch(zone) {
            case 0 -> "America/Los_Angeles";
            case 1 -> "America/Denver";
            case 2 -> "America/Chicago";
            case 3 -> "America/New_York";
            default -> null;
        };
    }

    /**
     * Create a new reminder by user request (opt-in)
     * @param request - Information of when to send reminder and type
     * @return - Message on success, badRequest otherwise
     */
    @RequestMapping(value="create_reminder", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createReminder(@RequestBody ReminderRequest request) {
        User user = getCurrentUser();

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
        reminder.setJobID(jobID + reminder.getReminderID());
        reminder = reminderRepository.save(reminder); // Persist the reminder to get a reminderID
        ReminderTask reminderTask = new ReminderTask(cron, reminder);

        reminderExecutor.setReminderTask(reminderTask);
        schedulingService.scheduleATask(reminder.getJobID(), reminderExecutor, cron, getZoneName(request.getTimezone()));

        user.addReminder(reminder);

        return ResponseEntity.ok("Success");
    }

    /**
     * Test endpoint for checking reminder. TODO Remove when not needed.
     * @return
     */
    @RequestMapping(value="get_reminder", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Reminder> getReminder() {
        User user = getCurrentUser();

        Reminder reminder = new Reminder(user, new Time(System.currentTimeMillis()), 1);

        return ResponseEntity.ok(reminder);
    }

    /**
     * Cancel a reminder with the hash given in the reminder itself (link).
     * @param hash - hashed jobID.
     * @return - Message on success/failure.
     */
    @RequestMapping(value="cancel_reminder/{hash}", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> cancelReminder(@PathVariable String hash) {
        Base64.Decoder decoder = Base64.getUrlDecoder();
        String decrypted = new String(decoder.decode(hash)); // reminder_id
        System.out.println("GOT CANCEL REQUEST DECRYPTED: " + decrypted);
        long reminderID;
        try {
            reminderID = Long.parseLong(decrypted);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().build();
        }


        Reminder reminder = reminderRepository.findByReminderID(reminderID).orElseThrow();
        reminder.getUser().removeReminder(reminder);
        // Valid delete request
        schedulingService.removeScheduledTask(reminder.getJobID());
        reminderRepository.delete(reminder);

        return ResponseEntity.ok("Reminder Deleted Successfully.\n" +
                    "You can exit out of this tab.");
    }

    /**
     * Periodic scheudled function to check email inbox for sms cancellation requests
     */
    @Transactional
    @Scheduled(fixedRate = 90000) // 60000 is 1.5m in ms
    public void checkTextCancel() {
        String[] requests = emailService.checkAndProcessInbox();
        for (String request : requests) {
            System.out.println("NotifCont: CANCELLING REMINDER TEXT");
            System.out.println("----------------------------------REQ: <" + request + ">");
            cancelMobileReminders(request.replace("\"", "").replace("\n", ""));
        }
    }

    /**
     * Helper method to cancel mobile reminders for checkTextCancel periodic function.
     * @param request - String with record ID and phone number to validate and cancel request.
     */
    @Transactional
    public void cancelMobileReminders(String request) {
        String[] req = request.split(" ");
        long reminderID = Long.parseLong(req[0].replaceAll("\\s",""));
        String phoneEmail = req[1].replaceAll("\\s","");
        String phone = phoneEmail.split("@")[0].replaceAll("\\s","");

        Reminder reminder = reminderRepository.findByReminderID(reminderID).orElse(null);
        if (reminder != null && reminder.getUser().getPhone().equals(phone)) {
            reminder.getUser().removeReminder(reminder);
            schedulingService.removeScheduledTask(reminder.getJobID());
            reminderRepository.delete(reminder);
            reminderRepository.deleteById(reminderID);
            EmailDetails details = new EmailDetails(phoneEmail, "", "SM Your reminder has been deleted.", null);
            emailService.sendSimpleMail(details);
            return;
        }

        EmailDetails details = new EmailDetails(phoneEmail, "", "SM Sorry, we didn't find this reminder.", null);
        emailService.sendSimpleMail(details);

    }

    /**
     * TEST endpoint for sending texts -- dont spam me TODO Remove
     * @return
     */
    @RequestMapping(value="test/{carrier}/{phone}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> test(@PathVariable String carrier, @PathVariable String phone) {
        String recipient = phone + emailService.getCarrierGateway(carrier);
        EmailDetails details = new EmailDetails(recipient, "TestBody", "testSubject", null);
        emailService.sendSimpleMail(details);
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
            schedulingService.scheduleATask(jobID, reminderExecutor, cron, getZoneName(reminder.getTimezone()));
        }
    }

}

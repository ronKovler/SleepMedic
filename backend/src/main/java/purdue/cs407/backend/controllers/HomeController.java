package purdue.cs407.backend.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import purdue.cs407.backend.dtos.*;
import purdue.cs407.backend.entities.SleepRecord;
import purdue.cs407.backend.entities.User;
import purdue.cs407.backend.repositories.RecordRepository;
import purdue.cs407.backend.repositories.UserRepository;
import java.sql.Date;
import java.sql.Time;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/home/")
@CrossOrigin(origins = "*")
public class HomeController {
    private final RecordRepository recordRepository;

    public HomeController( RecordRepository recordRepository ) {
        this.recordRepository = recordRepository;
    }

    /**
     * Helper method to view current user from session.
     * @return - User of current session.
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }


    /**
     * Give the user their weekly average statistics.
     * /home/average
     * @return WeekAverageResponse (DTO) containing all averaged values
     */
    @RequestMapping(value="average", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WeekAverageResponse> getWeeklyAverages() {
        // Get the user
        User user = getCurrentUser();

        Collection<SleepRecord> records = recordRepository.getLastSeven(user);

        // Not enough data, return empty.
        if (records.size() < 7) {
            return ResponseEntity.ok(new WeekAverageResponse());
        }

        double hoursSleptTotal = 0;
        int fallTimeTotal = 0;
        long downTimeTotal = 0;
        long upTimeTotal = 0;
        long sleepTimeTotal = 0;
        long wakeTimeTotal = 0;
        int awakeTimeTotal = 0;
        int qualityTotal = 0;
        double efficiencyTotal = 0;

        Date noon = new Date(12 * 60 * 60 * 1000);
        Date day = new Date(24 * 60 * 60 * 1000);

        //TODO idk whats right anymroe come back and fix this
        for (SleepRecord record: records) {
            hoursSleptTotal += record.hoursSlept();
            fallTimeTotal += record.getFallTime();
            downTimeTotal += record.getDownTime().getTime();
            if (record.getDownTime().before(noon)) {
                downTimeTotal += day.getTime();
                // This accounts for times after midnight so their avg time isn't shifted forward accidentally.
                // TODO similar update might be necessary for upTime and wakeTime, idts(no?) rn.
            }
            upTimeTotal += record.getUpTime().getTime();
            sleepTimeTotal += record.getSleepTime().getTime();
            if (record.getSleepTime().before(noon)) {
                // This accounts for times after midnight so their avg time isn't shifted forward accidentally.
                sleepTimeTotal += day.getTime();
            }
            wakeTimeTotal += record.getWakeTime().getTime();
            awakeTimeTotal += record.getAwakeTime();
            qualityTotal += record.getQuality();
            efficiencyTotal += record.getEfficiency();
        }

        DecimalFormat df = new DecimalFormat("#.##");

        int count = records.size();
        Time avgDownTime = new Time(downTimeTotal / count);
        Time avgUpTime = new Time(upTimeTotal / count);
        double avgHoursSlept = hoursSleptTotal / (double) count;
        avgHoursSlept = Double.parseDouble(df.format(avgHoursSlept));
        int avgFallTime = fallTimeTotal / count;
        Time avgWakeTime = new Time(wakeTimeTotal / count);
        Time avgSleepTime = new Time(sleepTimeTotal / count);
        double avgQuality = (double) qualityTotal / count;
        avgQuality = Double.parseDouble(df.format(avgQuality));
        int avgAwakeTime = awakeTimeTotal / count;

        double avgEfficiency = efficiencyTotal / count;


        return ResponseEntity.ok(new WeekAverageResponse(avgDownTime, avgUpTime, avgHoursSlept,
                avgFallTime, avgWakeTime, avgSleepTime, avgQuality, avgAwakeTime, avgEfficiency));
    }

    /**
     * View all sleep records from this month
     * @return - List of sleep records of this month by the user
     */
    @RequestMapping(value="month", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<RecordResponse>> getMonthOfRecords() {
        // Get the user
        User user = getCurrentUser();

        LocalDate date = LocalDate.now();
        LocalDate start = date.withDayOfMonth(1);
        LocalDate end = date.withDayOfMonth(date.getMonth().length(date.isLeapYear()));


        Date startDate = Date.valueOf(start);
        Date endDate = Date.valueOf(end);

        Collection<SleepRecord> records = recordRepository.getBetween(user.getUserID(), startDate.toString(), endDate.toString());

        return ResponseEntity.ok(records.stream().map(RecordResponse::new).collect(Collectors.toList()));
    }

    /**
     * Get the calendar dates for the current month that have records.
     * @return - List of dates from current month for which a user has existing records.
     */
    @RequestMapping(value = "calendar/{date}", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Date>> getCalendar(@PathVariable Date date) {
        User user = getCurrentUser();

        LocalDate now = date.toLocalDate();
        LocalDate start = now.withDayOfMonth(1);
        LocalDate end = now.withDayOfMonth(now.getMonth().length(now.isLeapYear()));

        Date startDate = Date.valueOf(start);
        Date endDate = Date.valueOf(end);

        Collection<Date> dates = recordRepository.getCalendarDates(user.getUserID(), startDate.toString(), endDate.toString());

        return ResponseEntity.ok(dates.stream().toList());
    }

    /**
     * Get the users info (name)
     * @return - First / last names and education progress.
     */
    @RequestMapping(value="info", method = {RequestMethod.OPTIONS, RequestMethod.GET},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InfoResponse> getInfo() {
        // Get the user
        User user = getCurrentUser();
        int week = (user.getEducationProgress() >> 4) & 0b00001111;
        int day = user.getEducationProgress() & 0b00001111;
        double progress = ((7.0 * week + day) / (7.0 * 6));
        return ResponseEntity.ok(new InfoResponse(user.getFirstName(), user.getLastName(), progress));
    }

    /**
     * View an individual record
     * @param date - date of record to view
     * @return - record if found from user, notFound error else
     */
    @RequestMapping(value="view_record/{date}", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ViewResponse> getRecord(@PathVariable Date date) {
        User user = getCurrentUser();

        SleepRecord record = recordRepository.findByUserAndDate(user, date).orElse(null);

        if (record != null) {
            return ResponseEntity.ok(new ViewResponse(record));
        }

        // User requested invalid record, denied.
        return ResponseEntity.notFound().build();
    }

    /**
     * Create a new sleep record
     * @param request - Contains details about the record
     * @return - Message upon success
     */
    @RequestMapping(value="create_record", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createRecord(@RequestBody RecordRequest request) {
        User user = getCurrentUser();

        if (recordRepository.existsByUserAndDate(user, request.getDate())) {
            // Record already exists for that date, edit it instead of creating a new one (return error for now)
            return ResponseEntity.status(409).build();
        }

        SleepRecord record = new SleepRecord(request, user);
        double efficiency = record.hoursSlept() / record.hoursInBed();
        record.setEfficiency(efficiency);
        user.addRecord(record);
        record = recordRepository.save(record);

        String response = analyzeData(record);

        return ResponseEntity.ok(response);
    }

    /**
     * Helper method to analyze data on creation for feedback TODO update and finish to use advice ID instead
     * @param record - SleepRecord to analyze
     * @return - List of advice IDs (int)
     */
    private String analyzeData(SleepRecord record) {
        StringBuilder data = new StringBuilder();
        if (record.getEfficiency() >= 0.87) {
            data.append(String.format("You achieved %.2f sleep efficiency, nice job!\n", record.getEfficiency()));
        } else {
            data.append(String.format("Your sleep efficiency was %.2f, try to minimize the time spent in bed when you're not sleeping!\n", record.getEfficiency()));
        }

        long fifteenMin = 15 /*minutes*/ * 60 /*seconds*/ * 1000 /*ms*/;
        if (record.hoursSlept() < 7.0) {
            data.append("It looks like you should try to get more sleep, most people need around 7-8 hours each night.\n");
        } else if (record.hoursSlept() > 8.0) {
            data.append("Be careful about sleeping too much in one night, it can affect your other nights sleep. Shoot for 7-8 hours.\n");
        } else if (record.getEfficiency() <= 0.87 || record.getEfficiency() >= 0.95){
            // User is getting good amount of sleep, check if time in bed before sleep greater than time in bed after sleep
            long morningTime = record.getUpTime().getTime() - record.getWakeTime().getTime();
            long eveningTime = record.getSleepTime().getTime() - record.getDownTime().getTime();
            if (eveningTime > fifteenMin && morningTime > eveningTime) {
                Time newTime = new Time(record.getUpTime().getTime() - fifteenMin);
                data.append("Try to get out of bed around ").append(newTime).append(" next time. It's important to only spend time in bed when you are actively sleeping.\n");
            } else if (morningTime > fifteenMin && eveningTime > morningTime) {
                Time newTime = new Time(record.getDownTime().getTime() + fifteenMin);
                data.append("Try to get into bed later around ").append(newTime).append(" next time. This helps your body associate bed time with sleep time.");
            }
        }
        return data.toString();
    }

    /**
     * Update User sleep record (already existing record)
     */
    @RequestMapping(value = "update_record/{recordId}", method = RequestMethod.PATCH,
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateRecord(@PathVariable("recordId") Long recordId,
                                               @RequestBody RecordRequest request) {
        User currentUser = getCurrentUser();

        Optional<SleepRecord> optionalRecord = recordRepository.findById(recordId);
        if (optionalRecord.isEmpty()) {
            // does not exist
            return ResponseEntity.status(404).build();
        }

        SleepRecord record = optionalRecord.get();

        // In a case were user does not have permission to update the record
        if (!record.getUser().equals(currentUser)) {
            return ResponseEntity.status(403).build();
        }

        if (recordRepository.existsByUserAndDateAndRecordIDNot(currentUser, request.getDate(), recordId)){
            return ResponseEntity.status(409).build();
        }

        // Now we can update the record with the new data
        record.setDate(request.getDate());
        record.setSleepTime(request.getSleepTime());
        record.setWakeTime(request.getWakeTime());
        record.setDownTime(request.getDownTime());
        record.setUpTime(request.getUpTime());
        record.setJournal(request);
        record.setFallTime(request.getFallTime());
        record.setAwakeTime(request.getAwakeTime());
        record.setQuality(request.getQuality());
        record.setDreams(request.getDreams());

        double efficiency = record.hoursSlept() / record.hoursInBed();
        record.setEfficiency(efficiency);
        recordRepository.save(record);

        return ResponseEntity.ok("Record updated successfully");
    }

}

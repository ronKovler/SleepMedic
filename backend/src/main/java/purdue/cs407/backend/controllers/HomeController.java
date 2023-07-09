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
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/home/")
@CrossOrigin(origins = "*")
public class HomeController {
    private final UserRepository userRepository;
    private final RecordRepository recordRepository;

    public HomeController(UserRepository userRepository, RecordRepository recordRepository ) {
        this.userRepository = userRepository;
        this.recordRepository = recordRepository;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }


    /**
     * Give the user their weekly average statistics.
     * /api/home/average
     * @return WeekAverageResponse (DTO) containing all averaged values
     */
    @RequestMapping(value="average", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WeekAverageResponse> getWeeklyAverages() {
        // Get the user
        User user = getCurrentUser();

        LocalDate date = LocalDate.now();
        LocalDate start = date;
        while (start.getDayOfWeek() != DayOfWeek.SUNDAY) {
            start = start.minusDays(1);
        }

        LocalDate end = date;
        while (end.getDayOfWeek() != DayOfWeek.SATURDAY) {
            end = end.plusDays(1);
        }

        Date startDate = Date.valueOf(start);
        Date endDate = Date.valueOf(end);
        System.out.println("Getting weekly averages for DATE: " + startDate.toString() + " USERID: " +
                user.getUserID().toString());
        Collection<SleepRecord> records = recordRepository.getBetween(user.getUserID(),
                startDate.toString(), endDate.toString());

        // No data for week available, return empty.
        if (records.size() == 0) {
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

        for (SleepRecord record: records) {
            hoursSleptTotal += record.hoursSlept();
            fallTimeTotal += record.getFallTime();
            downTimeTotal += record.getDownTime().getTime();
            upTimeTotal += record.getUpTime().getTime();
            sleepTimeTotal += record.getSleepTime().getTime();
            wakeTimeTotal += record.getWakeTime().getTime();
            awakeTimeTotal += record.getAwakeTime();
            qualityTotal += record.getQuality();
            efficiencyTotal += record.getEfficiency();
        }

        int count = records.size();
        Time avgDownTime = new Time(downTimeTotal / count);
        Time avgUpTime = new Time(upTimeTotal / count);
        double avgHoursSlept = hoursSleptTotal / (double) count;
        int avgFallTime = fallTimeTotal / count;
        Time avgWakeTime = new Time(wakeTimeTotal / count);
        Time avgSleepTime = new Time(sleepTimeTotal / count);
        double avgQuality = (double) qualityTotal / count;
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
    public ResponseEntity<List<SleepRecord>> getCalendar() {
        // Get the user
        User user = getCurrentUser();

        LocalDate date = LocalDate.now();
        LocalDate start = date.withDayOfMonth(1);
        LocalDate end = date.withDayOfMonth(date.getMonth().length(date.isLeapYear()));


        Date startDate = Date.valueOf(start);
        Date endDate = Date.valueOf(end);

        Collection<SleepRecord> records = recordRepository.getBetween(user.getUserID(), startDate.toString(), endDate.toString());

        return ResponseEntity.ok(records.stream().toList());

    }

    /**
     * Get the users info (name)
     * @return - First and last names.
     */
    @RequestMapping(value="info", method = {RequestMethod.OPTIONS, RequestMethod.GET},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InfoResponse> getInfo() {
        // Get the user
        User user = getCurrentUser();
        return ResponseEntity.ok(new InfoResponse(user.getFirstName(), user.getLastName()));

    }

    /**
     * View an individual record
     * @param recordID - ID of record to view
     * @return - record if found from user, notFound error else
     */
    @RequestMapping(value="view_record/{recordID}", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SleepRecord> getRecord(@PathVariable long recordID) {
        User user = getCurrentUser();

        SleepRecord record = recordRepository.findByRecordID(recordID);

        if (user.equals(record.getUser())) {
            return ResponseEntity.ok(record);
        }

        // User requested someone else's sleep record, denied.
        return ResponseEntity.notFound().build();
    }

    /**
     * Create a new sleep record
     * @param request - Contains details about the record
     * @return - Message upon success
     */
    @RequestMapping(value="create_record", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
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
        recordRepository.save(record);

        return ResponseEntity.ok("Success");
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

        // Now we can update the record with the new data
        record.setDate(request.getDate());
        record.setSleepTime(request.getSleepTime());

        recordRepository.save(record);

        return ResponseEntity.ok("Record updated successfully");
    }

}

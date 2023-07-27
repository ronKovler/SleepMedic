package purdue.cs407.backend.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import purdue.cs407.backend.dtos.*;
import purdue.cs407.backend.entities.SleepRecord;
import purdue.cs407.backend.entities.User;
import purdue.cs407.backend.pojos.AverageRecord;
import purdue.cs407.backend.repositories.RecordRepository;

import java.sql.Date;
import java.sql.Time;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.util.ArrayList;
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
     * @return AverageResponse (DTO) containing all averaged values
     */
    @RequestMapping(value="average", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AverageResponse> getWeeklyAverages() {
        // Get the user
        User user = getCurrentUser();

        Collection<SleepRecord> records = recordRepository.getLastSeven(user);
        // Not enough data, return empty.
        if (records.size() < 1) {
            return ResponseEntity.ok(new AverageResponse());
        }

        AverageRecord averages = new AverageRecord(records.stream().toList());
        return ResponseEntity.ok(new AverageResponse(averages));
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
     * @return - Message upon success, 409 on record already existing for given date.
     */
    @RequestMapping(value="create_record", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<AdviceResponse>> createRecord(@RequestBody RecordRequest request) {
        User user = getCurrentUser();

        if (recordRepository.existsByUserAndDate(user, request.getDate())) {
            // Record already exists for that date, edit it instead of creating a new one (return error for now)
            return ResponseEntity.status(409).build();
        }

        SleepRecord record = new SleepRecord(request, user);
        user.addRecord(record);
        ArrayList<AdviceResponse> response = analyzeData(record);
        record = recordRepository.save(record);

        return ResponseEntity.ok(response);
    }

    /**
     * Helper method to analyze data on creation for feedback TODO update and finish to use advice ID instead
     *
     * @return - List of advice IDs (int)
     */
    /*
    *
    * Want hours slept to be >= 7 and <= 8
    * Efficiency > 85%, < 90%
    * Check journal - any negative field > 50% we don't want, any positive field < 50% we don't want
    * BEFORE ANY OF THIS, we need a baseline of 2 weeks of data
    * Avg upTime, avg hoursSlept,
    * */
    private ArrayList<AdviceResponse> analyzeData(SleepRecord record) {
        // Create array to hold our response data.
        ArrayList<AdviceResponse> data = new ArrayList<>();

        // Collect and average data (check if we have enough too before wasting cpu)
        Collection<SleepRecord> records = recordRepository.getLastTwoWeeks(record.getUser());
        if (records.size() < 13) {

            data.add(new AdviceResponse(-1, null)); // Base case not enough data, -1 corresponds to this on frontend
            return data;
        }
        // This averages records which is the last 14 records
        AverageRecord averages = new AverageRecord(records.stream().toList());

        //Calculate baseline from 2 weeks of data
        long fifteenMin = 15 /*minutes*/ * 60 /*seconds*/ * 1000 /*ms*/;
        long avgMorningTime = averages.getUpTime() - averages.getWakeTime();
        long avgEveningTime = averages.getSleepTime() - averages.getDownTime();

        //Firstly, check the hours slept from averaged data
        //Provide compression / expansion advice if sleep too much/little
        if (averages.getHoursSlept() < 7.0){

            data.add(new AdviceResponse(10, null)); // Sleeping not enough!
            if (avgMorningTime > fifteenMin) {

                Time newTime = new Time(averages.getWakeTime() + fifteenMin);
                data.add(new AdviceResponse(12, newTime.toString())); // adviceID 12, 'Try waking up later like around <<VAR>>'
            } else {

                Time newTime = new Time(averages.getSleepTime() - fifteenMin);
                data.add(new AdviceResponse(13, newTime.toString())); // adviceID 12, 'Try going to sleep earlier like around <<VAR>>'
            }

        } else if (averages.getHoursSlept() > 8) {

            Time newTime = new Time(averages.getSleepTime() + fifteenMin);
            data.add(new AdviceResponse(11, newTime.toString())); // Sleeping too much, try going to bed later around <<VAR>>'

        } else {
            // If getting good amount of sleep, alter the efficiency.
            if (record.getEfficiency() > 90) {
                data.add(new AdviceResponse(0, null)); // EFFICIENCY TOO HIGH lower it

            } else if (record.getEfficiency() < 85) {
                data.add(new AdviceResponse(1, null)); // EFFICIENCY IS too low, raise it
                if (avgEveningTime > avgMorningTime && avgEveningTime > fifteenMin) {
                    Time newTime = new Time(averages.getDownTime() + fifteenMin);
                    data.add(new AdviceResponse(2, newTime.toString())); // You're spending too much time in bed, try getting in at <<VAR>>'
                } else if (avgMorningTime > fifteenMin) {
                    Time newTime = new Time(averages.getUpTime() - fifteenMin);
                    data.add(new AdviceResponse(3, newTime.toString())); // You're Spending too much time in bed, try getting out at <<VAR>>
                }
            }
        }

        double[] journal = averages.getJournal();
        // Lastly analyze journal data
        if (journal[0] < 0.5) {
            // physical activity less than 50%
            data.add(new AdviceResponse(20, null));
        }
        if (journal[4] > 0.5) {
            // electronics activity more than 50%
            data.add(new AdviceResponse(21, null));
        }
        if (journal[3] > 0.5) {
            // caffeine activity more than 50%
            data.add(new AdviceResponse(22, null));
        }
        if (journal[2] > 0.5) {
            // alcohol activity more than 50%
            data.add(new AdviceResponse(23, null));
        }

        return data;
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
        long tempDownTime = request.getDownTime().getTime();
        if (tempDownTime < (12 * 60 * 60 * 1000)) {
            tempDownTime += (24 * 60 * 60 * 1000);
        }
        long tempSleepTime = request.getSleepTime().getTime();
        if (tempSleepTime < tempDownTime) {
            tempSleepTime += (24 * 60 * 60 * 1000);
        }
        long tempWakeTime = request.getWakeTime().getTime();
        if (tempWakeTime < tempSleepTime) {
            tempWakeTime += (24 * 60 * 60 * 1000);
        }
        long tempUpTime = request.getUpTime().getTime();
        if (tempUpTime < tempWakeTime) {
            tempUpTime += (24 * 60 * 60 * 1000);
        }
        record.setSleepTime(tempSleepTime);
        record.setWakeTime(tempWakeTime);
        record.setDownTime(tempDownTime);
        record.setUpTime(tempUpTime);
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

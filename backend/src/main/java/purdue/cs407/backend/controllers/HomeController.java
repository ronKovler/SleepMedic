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

        return ResponseEntity.ok(getAveragedData(records.stream().toList()));
    }

    public AverageResponse getAveragedData(List<SleepRecord> records) {
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


        return new AverageResponse(avgDownTime, avgUpTime, avgHoursSlept,
                avgFallTime, avgWakeTime, avgSleepTime, avgQuality, avgAwakeTime, avgEfficiency);
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
    public ResponseEntity<List<AdviceResponse>> createRecord(@RequestBody RecordRequest request) {
        User user = getCurrentUser();

        if (recordRepository.existsByUserAndDate(user, request.getDate())) {
            // Record already exists for that date, edit it instead of creating a new one (return error for now)
            return ResponseEntity.status(409).build();
        }

        SleepRecord record = new SleepRecord(request, user);
        double efficiency = record.hoursSlept() / record.hoursInBed();
        record.setEfficiency(efficiency);
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
    * Efficieny > 85%, < 90%
    * Check journal - any negative field > 50% we dont want, any positive field < 50% we don't want
    * BEFORE ANY OF THIS, we need a baseline of 2 weeks of data
    * Avg up time, avg hoursSlept,
    * */
    private ArrayList<AdviceResponse> analyzeData(SleepRecord record) {
        Collection<SleepRecord> records = recordRepository.getLastTwoWeeks(record.getUser());
        ArrayList<AdviceResponse> data = new ArrayList<>();
        if (records.size() < 13) {
            data.add(new AdviceResponse(-1, null)); // Base case not enough data, -1 corresponds to this on frontend
            return data;
        }
        int[] averageJ = new int[8];
        records.forEach(rec -> {
            byte j = rec.getJournal();
            if ((j & 0b10000000) != 0) averageJ[0] += 1;
            if ((j & 0b01000000) != 0) averageJ[1] += 1;
            if ((j & 0b00100000) != 0) averageJ[2] += 1;
            if ((j & 0b00010000) != 0) averageJ[3] += 1;
            if ((j & 0b00001000) != 0) averageJ[4] += 1;
            if ((j & 0b00000100) != 0) averageJ[5] += 1;
            if ((j & 0b00000010) != 0) averageJ[6] += 1;
            if ((j & 0b00000001) != 0) averageJ[7] += 1;
        });

        //Calculate baseline from 2 weeks of data
        AverageResponse averages = getAveragedData(records.stream().toList());
        long fifteenMin = 15 /*minutes*/ * 60 /*seconds*/ * 1000 /*ms*/;
        long avgMorningTime = averages.getUpTime().getTime() - averages.getWakeTime().getTime();
        long avgEveningTime = averages.getSleepTime().getTime() - averages.getDownTime().getTime();

        //Firstly, check the hours slept from averaged data
        //Provide compression / expansion advice if sleep too much/little
        if (averages.getHoursSlept() < 7.0){
            data.add(new AdviceResponse(10, null)); // Sleeping not enough!
            if (avgMorningTime > fifteenMin) {
                Time newTime = new Time(averages.getWakeTime().getTime() + fifteenMin);
                data.add(new AdviceResponse(12, newTime.toString())); // adviceID 12, 'Try waking up later like around <<VAR>>'
            } else {
                Time newTime = new Time(averages.getSleepTime().getTime() - fifteenMin);
                data.add(new AdviceResponse(13, newTime.toString())); // adviceID 12, 'Try going to sleep earlier like around <<VAR>>'
            }

        } else if (averages.getHoursSlept() > 8) {
            Time newTime = new Time(averages.getSleepTime().getTime() + fifteenMin);
            data.add(new AdviceResponse(11, null)); // Sleeping too much, try going to bed later around <<VAR>>'
        } else {
            // If getting good amount of sleep, alter the efficiency.
            if (record.getEfficiency() > 0.90) {
                data.add(new AdviceResponse(0, null)); // EFFICIENCY TOO HIGH lower it

            } else if (record.getEfficiency() < 0.85) {
                data.add(new AdviceResponse(1, null)); // EFFICIENCY IS too low, raise it
                if (avgEveningTime > avgMorningTime && avgEveningTime > fifteenMin) {
                    Time newTime = new Time(averages.getDownTime().getTime() + fifteenMin);
                    data.add(new AdviceResponse(2, newTime.toString())); // You're spending too much time in bed, try getting in at <<VAR>>'
                } else if (avgMorningTime > fifteenMin) {
                    Time newTime = new Time(averages.getUpTime().getTime() - fifteenMin);
                    data.add(new AdviceResponse(3, newTime.toString())); // You're Spending too much time in bed, try getting out at <<VAR>>
                }
            }
        }

        // Lastly analyze journal data
        if (((double) averageJ[0] / records.size()) < 0.5) {
            // physical activity less than 50%
            data.add(new AdviceResponse(30, null));
        }
        if (((double) averageJ[4] / records.size()) > 0.5) {
            // electronics activity more than 50%
            data.add(new AdviceResponse(31, null));
        }
        if (((double) averageJ[3] / records.size()) > 0.5) {
            // caffine activity more than 50%
            data.add(new AdviceResponse(32, null));
        }
        if (((double) averageJ[2] / records.size()) > 0.5) {
            // alcahol activity more than 50%
            data.add(new AdviceResponse(33, null));
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

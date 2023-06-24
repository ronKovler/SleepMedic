package purdue.cs407.backend.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import purdue.cs407.backend.DTO.*;
import purdue.cs407.backend.models.SleepRecord;
import purdue.cs407.backend.models.User;
import purdue.cs407.backend.repositories.RecordRepository;
import purdue.cs407.backend.repositories.UserRepository;
import purdue.cs407.backend.service.AuthService;

import java.sql.Date;
import java.sql.Time;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

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
        String email = authentication.getName();;
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

        List<SleepRecord> records = recordRepository.findAllByUserAndDateBetween(user, startDate, endDate);

        // No data for week available, return empty.
        if (records.size() == 0) {
            return ResponseEntity.ok(new WeekAverageResponse());
        }

        int hoursSleptTotal = 0;
        int fallingTimeTotal = 0;
        long downTimeTotal = 0;
        long upTimeTotal = 0;
        int wakeUpCountTotal = 0;
        int restlessnessTotal = 0;

        for (SleepRecord record: records) {
            hoursSleptTotal += record.getSleepTime();
            fallingTimeTotal += record.getFallingTime();
            downTimeTotal += record.getDownTime().getTime();
            upTimeTotal += record.getUpTime().getTime();
            wakeUpCountTotal += record.getWakeUpCount();
            restlessnessTotal += record.getRestlessness();
        }

        int count = records.size();
        Time avgDownTime = new Time(downTimeTotal / count);
        Time avgUpTime = new Time(upTimeTotal / count);
        double avgHoursSlept = (double)hoursSleptTotal / (double)count;
        int avgFallingTime = fallingTimeTotal / count;
        int avgWakeUpCount = wakeUpCountTotal / count;
        int avgRestlessness = restlessnessTotal / count;

        return ResponseEntity.ok(new WeekAverageResponse(avgFallingTime, avgHoursSlept, avgWakeUpCount, avgDownTime, avgUpTime, avgRestlessness));
//        SELECT AVG(sleep_time), CONVERT(AVG(CONVERT(down_time AS INT)) AS DATE), AVG(falling_time), AVG(restlessness), CONVERT(AVG(CONVERT(up_time AS INT)) AS DATE), AVG(wake_up_count)
//        FROM sleep_record
//        WHERE date >= STR_TO_DATE('06/18/2023', '%m/%d/%Y') AND date <= STR_TO_DATE('06/24/2023', '%m/%d/%Y')
//        GROUP BY user_id
//        HAVING user_id = 17
    }

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

        List<SleepRecord> records = recordRepository.findAllByUserAndDateBetween(user, startDate, endDate);

        return ResponseEntity.ok(records);

    }

    @RequestMapping(value="info", method = {RequestMethod.OPTIONS, RequestMethod.GET},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<InfoResponse> getInfo() {
        // Get the user
        User user = getCurrentUser();


        return ResponseEntity.ok(new InfoResponse(user.getFirstName(), user.getLastName()));

    }

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

    @RequestMapping(value="create_record", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createRecord(@RequestBody RecordRequest request) {
        User user = getCurrentUser();

        if (recordRepository.existsByUserAndDate(user, request.getDate())) {
            // Record already exists for that date, edit it instead of creating a new one (return error for now)
            return ResponseEntity.status(409).build();
        }

        SleepRecord record = new SleepRecord(request, user);
        recordRepository.save(record);

        return ResponseEntity.ok("Success");
    }

}

package purdue.cs407.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import purdue.cs407.backend.dtos.RecordRequest;

import java.sql.Date;
import java.sql.Time;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "sleep_record")
public class SleepRecord  {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "record_ID")
    /* TABLE indicates that the persistence provider must assign primary keys
    for the entity using an underlying database table to ensure uniqueness */
    private Long recordID;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name="user_ID")
    private User user;

    @Column(name="date")
    private Date date;

    @Column(name="down_time")
    private long downTime;

    @Column(name="up_time")
    private long upTime;

    @Column(name="fall_time")
    private int fallTime;

    @Column(name="sleep_time")
    private long sleepTime;

    @Column(name="wake_time")
    private long wakeTime;

    @Column(name="awake_time")
    private int awakeTime;

    @Column(name="quality")
    private int quality;

    @Column(name="efficiency")
    private double efficiency;

    /**
             * (01000000) 1 - physical activity, 2 - naps, 3 - alcohol, 4- caffeine, 5-electronics, 6- difficultStayingAsleep
     * 7 - difficultFallingAsleep, LEAST SIG BIT (00000001) 8- racingThoughts,
     */
    @Column(name="journal")
    private byte journal;

    @Column(name="dreams")
    private String dreams;


    public SleepRecord(Long recordID, User user, Date date, long downTime, long upTime, int fallTime, long sleepTime,
                       long wakeTime, int awakeTime, int quality, double efficiency, byte journal) {
        this.recordID = recordID;
        this.user = user;
        this.date = date;
        this.downTime = downTime;
        this.upTime = upTime;
        this.fallTime = fallTime;
        this.sleepTime = sleepTime;
        this.wakeTime = wakeTime;
        this.awakeTime = awakeTime;
        this.quality = quality;
        this.efficiency = efficiency;
        this.journal = journal;
    }

    public SleepRecord(RecordRequest request, User user) {
        this.user = user;
        this.date = request.getDate();

        /* TODO verify this is correct. I think it is */
        /*
        * My reasoning: We start off by assuming the user is going to bed PM the day of the record (date). Any record
        * we assume begins PM day of date. Therefore if downTime is before noon, ergo AM, we must add a day to it to
        * make it AM of date(day + 1). This ensures that all durations are calculated properly, and should be okay
        * if we are technically 'misrepresenting' the users data by shifting a record a day forward or back. This
        * ensures that if a user gets into bed at 11:30 PM and sleep at 12:00AM that the duration in bed before sleep
        * doesn't calculate as 00:00 - 23:30 but as 24:00 - 23:30. The order we presume must be logically followed is
        * down, sleep, wake, up. Therefore, we should check if downTime is in AM or PM, and adjust all other request
        * times based off the recorded time that should come before. So adjust sleep if its before downTime after we
        * adjusted it already. Then check wakeTime from the request to the recorded (maybe adjusted?) sleepTime aNd so on.
        *
        */
        Time noon = new Time(12* 60 * 60 * 1000);
        this.downTime = request.getDownTime().getTime();
        if (request.getDownTime().before(noon)) {
            // Downtime is AM, make add 24 hours to make it AM of next day.
            this.downTime += 24*60*60*1000;
        }

        this.sleepTime = request.getSleepTime().getTime();
        if (this.sleepTime < this.downTime) {
            // sleepTime needs boost forward (1 day)
            this.sleepTime += 24*60*60*1000;
        }

        this.wakeTime = request.getWakeTime().getTime();
        if (this.wakeTime < this.sleepTime) {
            this.wakeTime += 24*60*60*1000;
        }

        this.upTime = request.getUpTime().getTime();
        if (this.upTime < this.wakeTime) {
            this.upTime += 24*60*60*1000;
        }

        this.fallTime = request.getFallTime();
        this.awakeTime = request.getAwakeTime();
        this.quality = request.getQuality();
        this.setJournal(request);
        this.dreams = request.getDreams();
        this.efficiency = (this.hoursSlept() / this.hoursInBed()) * 100;

    }

    public SleepRecord() {

    }

    public Long getRecordID() {
        return recordID;
    }

    public void setRecordID(Long recordID) {
        this.recordID = recordID;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public long getDownTime() {
        return downTime;
    }

    public void setDownTime(long downTime) {
        this.downTime = downTime;
    }

    public long getUpTime() {
        return upTime;
    }

    public void setUpTime(long upTime) {
        this.upTime = upTime;
    }

    public int getFallTime() {
        return fallTime;
    }

    public void setFallTime(int fallTime) {
        this.fallTime = fallTime;
    }

    public long getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(long sleepTime) {
        this.sleepTime = sleepTime;
    }

    public long getWakeTime() {
        return wakeTime;
    }

    public void setWakeTime(long wakeTime) {
        this.wakeTime = wakeTime;
    }

    public Time getWakeTimeTime() {
        return new Time(this.wakeTime);
    }

    public Time getSleepTimeTime() {
        return new Time(this.sleepTime);
    }

    public Time getUpTimeTime() {
        return new Time(this.upTime);
    }

    public Time getDownTimeTime() {
        return new Time(this.downTime);
    }

    public int getAwakeTime() {
        return awakeTime;
    }

    public void setAwakeTime(int awakeTime) {
        this.awakeTime = awakeTime;
    }

    public int getQuality() {
        return quality;
    }

    public void setQuality(int quality) {
        this.quality = quality;
    }

    public double getEfficiency() {
        return efficiency;
    }

    public void setEfficiency(double efficiency) {
        this.efficiency = efficiency;
    }

    public byte getJournal() {
        return journal;
    }

    public void setJournal(byte journal) {
        this.journal = journal;
    }


    public String getDreams() {
        return dreams;
    }


    public void setDreams(String dreams) {
        this.dreams = dreams;
    }

    public void setJournal(RecordRequest request) {
        byte journal = 0;
        if(request.isPhysicalActivity()) {
            byte mask = (byte) 0b10000000;
            journal = (byte) (journal | mask);
        }
        if (request.isNaps()) {
            byte mask = 0b01000000;
            journal = (byte) (journal | mask);
        }
        if (request.isAlcoholConsumption()) {
            byte mask = 0b00100000;
            journal = (byte) (journal | mask);
        }
        if (request.isCaffeineConsumption()) {
            byte mask = 0b00010000;
            journal = (byte) (journal | mask);
        }
        if(request.isElectronics()) {
            byte mask = 0b00001000;
            journal = (byte) (journal | mask);
        }
        if (request.isDifficultStayingAsleep()) {
            byte mask = 0b00000100;
            journal = (byte) (journal | mask);
        }
        if (request.isDifficultFallingAsleep()) {
            byte mask = 0b00000010;
            journal = (byte) (journal | mask);
        }
        if (request.isRacingThoughts()) {
            byte mask = 0b00000001;
            journal = (byte) (journal | mask);
        }
        this.journal = journal;
    }

    public Map<String, Boolean> decodeJournal() {
        Map<String, Boolean> decoded = new HashMap<>();
        byte mask = (byte) 0b10000000;
        decoded.put("physicalActivity", (mask & this.journal) != 0);
        mask = 0b01000000;
        decoded.put("naps", (mask & this.journal) != 0);
        mask = 0b00100000;
        decoded.put("alcoholConsumption", (mask & this.journal) != 0);
        mask = 0b00010000;
        decoded.put("caffeineConsumption", (mask & this.journal) != 0);
        mask = 0b00001000;
        decoded.put("electronics", (mask & this.journal) != 0);
        mask = 0b00000100;
        decoded.put("difficultStayingAsleep", (mask & this.journal) != 0);
        mask = 0b00000010;
        decoded.put("difficultFallingAsleep", (mask & this.journal) != 0);
        mask = 0b00000001;
        decoded.put("racingThoughts", (mask & this.journal) != 0);

        return decoded;
    }

    public double hoursSlept() {
        int[] slept = getTimeAsInt(this.wakeTime - this.sleepTime);

        // time.getMinutes and .getHours() deprecated
        int hours = slept[0];
        int minutes = slept[1];

        //awakeTime is integer minutes
        hours -= (this.awakeTime / 60); //Should be -= 0 in most cases (I would hope but in case)
        minutes -= (this.awakeTime % 60);

        return hours + ((double) minutes / 60.0);
    }

//    public double hoursAwake() {
//        int hours = 0;
//        int minutes = 0;
//
//        int[] awakeEvening = getTimeAsInt(this.downTime, this.upTime);
//        hours += Integer.parseInt(awakeEvening[0]); //Hours in the evening
//        minutes += Integer.parseInt(awakeEvening[1]); // Minutes in the evening
//
//        hours += (this.awakeTime / 60); // Hours in the night
//        minutes += (this.awakeTime % 60); // Minutes in the night
//
//        String[] awakeMorning = getTimeDurationString(this.wakeTime, this.upTime).split(":");
//        hours += Integer.parseInt(awakeMorning[0]); // Hours in the morning
//        minutes += Integer.parseInt(awakeMorning[1]); // Minutes in morning
//
//        return hours + ((double) minutes / 60.0);
//    }

    public double hoursInBed() {
        int[] inBed = getTimeAsInt(this.upTime - this.downTime);

        int hours = inBed[0];
        int minutes = inBed[1];

        return hours + ((double) minutes / 60.0);
    }

//    public String getTimeDurationString(Time from, Time to) {
//        long start = from.getTime();
//        long end = to.getTime();
//
//        Time time = new Time(end - start);
//
//        return time.toString();
//    }

    public int[] getTimeAsInt(long time) {
        int hours = (int) (time / (60 * 60 * 1000));
        int minutes = (int) ((time % (60 * 60 * 1000)) / (60 * 1000));
        int[] ret = new int[2];
        ret[0] = hours;
        ret[1] = minutes;
        return ret;
    }

    @Override
    public String toString() {
        Map<String, Boolean> j = this.decodeJournal();
        return this.date + ", " + new Time(this.downTime) + ", " + new Time(this.sleepTime) + ", " + new Time(this.wakeTime) + ", " +
                new Time(this.upTime) + ", " + this.fallTime + ", " + this.awakeTime + ", " + this.quality + ", " +
                j.get("physicalActivity") + ", " + j.get("naps") + ", " + j.get("caffeineConsumption") + ", " +
                j.get("alcoholConsumption") + ", " + j.get("electronics") + ", " + j.get("difficultStayingAsleep") +
                ", " + j.get("difficultFallingAsleep") + ", " + j.get("racingThoughts") + ", " + dreams + "\n";
    }


}

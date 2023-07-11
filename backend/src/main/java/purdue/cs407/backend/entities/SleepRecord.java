package purdue.cs407.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import purdue.cs407.backend.dtos.RecordRequest;

import java.sql.Date;
import java.sql.Time;

@Entity
@Table(name = "sleep_record")
public class SleepRecord {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "record_ID")
    /* TABLE indicates that the persistence provider must assign primary keys
    for the entity using an underlying database table to ensure uniqueness */
    private Long recordID;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER) // Use lazy for speed
    @JoinColumn(name="user_ID")
    private User user;

    @Column(name="date")
    private Date date;

    @Column(name="down_time")
    private Time downTime;

    @Column(name="up_time")
    private Time upTime;

    @Column(name="fall_time")
    private int fallTime;

    @Column(name="sleep_time")
    private Time sleepTime;

    @Column(name="wake_time")
    private Time wakeTime;

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


    public SleepRecord(Long recordID, User user, Date date, Time downTime, Time upTime, int fallTime, Time sleepTime,
                       Time wakeTime, int awakeTime, int quality, double efficiency, byte journal) {
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
        this.downTime = request.getDownTime();
        this.upTime = request.getUpTime();
        this.fallTime = request.getFallTime();
        this.sleepTime = request.getSleepTime();
        this.wakeTime = request.getWakeTime();
        this.awakeTime = request.getAwakeTime();
        this.quality = request.getQuality();
        byte journal = 0;
        if(request.isPhysicalActivity()) {
            byte mask = 0b01000000;
            journal = (byte) (journal | mask);
        }
        if (request.isNaps()) {
            byte mask = 0b00100000;
            journal = (byte) (journal | mask);
        }
        if (request.isAlcoholConsumption()) {
            byte mask = 0b00010000;
            journal = (byte) (journal | mask);
        }
        if (request.isCaffeineConsumption()) {
            byte mask = 0b00001000;
            journal = (byte) (journal | mask);
        }
        if(request.isElectronics()) {
            byte mask = 0b00000100;
            journal = (byte) (journal | mask);
        }
        if (request.isDifficultStayingAsleep()) {
            byte mask = 0b00000010;
            journal = (byte) (journal | mask);
        }
        if (request.isDifficultFallingAsleep()) {
            byte mask = 0b00000001;
            journal = (byte) (journal | mask);
        }
        this.journal = journal;
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

    public Time getDownTime() {
        return downTime;
    }

    public void setDownTime(Time downTime) {
        this.downTime = downTime;
    }

    public Time getUpTime() {
        return upTime;
    }

    public void setUpTime(Time upTime) {
        this.upTime = upTime;
    }

    public int getFallTime() {
        return fallTime;
    }

    public void setFallTime(int fallTime) {
        this.fallTime = fallTime;
    }

    public Time getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(Time sleepTime) {
        this.sleepTime = sleepTime;
    }

    public Time getWakeTime() {
        return wakeTime;
    }

    public void setWakeTime(Time wakeTime) {
        this.wakeTime = wakeTime;
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

    public double hoursSlept() {
        long start = this.sleepTime.getTime();
        long end = this.wakeTime.getTime();

        String[] slept = (new Time(end - start)).toString().split(":");

        // time.getMinutes and .getHours() deprecated
        int hours = Integer.parseInt(slept[0]);
        int minutes = Integer.parseInt(slept[1]);

        //awakeTime is integer minutes
        hours -= (this.awakeTime / 60); //Should be -= 0 in most cases (I would hope but in case)
        minutes -= (this.awakeTime % 60);

        return hours + ((double) minutes / 60.0);
    }

    public double hoursAwake() {
        int hours = 0;
        int minutes = 0;

        String[] awakeEvening = getTimeDurationString(this.downTime, this.upTime).split(":");
        hours += Integer.parseInt(awakeEvening[0]); //Hours in the evening
        minutes += Integer.parseInt(awakeEvening[1]); // Minutes in the evening

        hours += (this.awakeTime / 60); // Hours in the night
        minutes += (this.awakeTime % 60); // Minutes in the night

        String[] awakeMorning = getTimeDurationString(this.wakeTime, this.upTime).split(":");
        hours += Integer.parseInt(awakeMorning[0]); // Hours in the morning
        minutes += Integer.parseInt(awakeMorning[1]); // Minutes in morning

        return hours + ((double) minutes / 60.0);
    }

    public double hoursInBed() {
        String[] inBed = getTimeDurationString(this.downTime, this.upTime).split(":");

        // time.getMinutes and .getHours() deprecated
        int hours = Integer.parseInt(inBed[0]);
        int minutes = Integer.parseInt(inBed[1]);

        return hours + ((double) minutes / 60.0);
    }

    public String getTimeDurationString(Time from, Time to) {
        long start = from.getTime();
        long end = to.getTime();

        Time time = new Time(end - start);

        return time.toString();
    }
}

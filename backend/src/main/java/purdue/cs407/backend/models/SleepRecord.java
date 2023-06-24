package purdue.cs407.backend.models;

import jakarta.persistence.*;
import purdue.cs407.backend.DTO.RecordRequest;

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

    @Column(name="sleep_time")
    private double sleepTime;

    @Column(name="falling_time")
    private int fallingTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_ID")
    private User user;

    @Column(name="date")
    private Date date;

    @Column(name="down_time")
    private Time downTime;

    @Column(name="up_time")
    private Time upTime;

    @Column(name="wake_up_count")
    private int wakeUpCount;

    @Column(name="restlessness")
    private int restlessness;

    @Column(name="dreams", length = 256)
    private String dreams;

    /**
     * Constructor with DREAMS
     * @param sleepTime - Time sleeping
     * @param fallingTime - Time spent falling asleep
     * @param user - User who owns record
     * @param date - Date record pertains to
     * @param downTime - Time user went to sleep HH:MM
     * @param upTime - Time user woke up HH:MM
     * @param wakeUpCount - Count of times user woke up
     * @param restlessness - Int 1 - 10 of how restless sleep was
     * @param dreams - Dream diary
     */
    public SleepRecord(int sleepTime, int fallingTime, User user, Date date, Time downTime, Time upTime, int wakeUpCount, int restlessness, String dreams) {
        this.sleepTime = sleepTime;
        this.fallingTime = fallingTime;
        this.user = user;
        this.date = date;
        this.downTime = downTime;
        this.upTime = upTime;
        this.wakeUpCount = wakeUpCount;
        this.restlessness = restlessness;
        this.dreams = dreams;
    }

    /**
     * Constructor WITHOUT DREAMS
     * @param sleepTime - Time sleeping
     * @param fallingTime - Time spent falling asleep
     * @param user - User who owns record
     * @param date - Date record pertains to
     * @param downTime - Time user went to sleep HH:MM
     * @param upTime - Time user woke up HH:MM
     * @param wakeUpCount - Count of times user woke up
     * @param restlessness - Int 1 - 10 of how restless sleep was
     */
    public SleepRecord(int sleepTime, int fallingTime, User user, Date date, Time downTime, Time upTime, int wakeUpCount, int restlessness) {
        this.sleepTime = sleepTime;
        this.fallingTime = fallingTime;
        this.user = user;
        this.date = date;
        this.downTime = downTime;
        this.upTime = upTime;
        this.wakeUpCount = wakeUpCount;
        this.restlessness = restlessness;
    }

    public SleepRecord(RecordRequest request, User user) {
        this.sleepTime = request.getSleepTime();
        this.fallingTime = request.getFallingTime();
        this.user = user;
        this.date = request.getDate();
        this.downTime = request.getDownTime();
        this.upTime = request.getUpTime();
        this.wakeUpCount = request.getWakeUpCount();
        this.restlessness = request.getRestlessness();
        this.dreams = request.getDreams();
    }

    public SleepRecord() {

    }

    public double getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(double sleepTime) {
        this.sleepTime = sleepTime;
    }

    public int getFallingTime() {
        return fallingTime;
    }

    public void setFallingTime(int fallingTime) {
        this.fallingTime = fallingTime;
    }

    public User getUser() {
        return user;
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

    public int getWakeUpCount() {
        return wakeUpCount;
    }

    public void setWakeUpCount(int wakeUpCount) {
        this.wakeUpCount = wakeUpCount;
    }

    public int getRestlessness() {
        return restlessness;
    }

    public void setRestlessness(int restlessness) {
        this.restlessness = restlessness;
    }

    public String getDreams() {
        return dreams;
    }

    public void setDreams(String dreams) {
        this.dreams = dreams;
    }

    public Long getRecordID() {
        return recordID;
    }
}

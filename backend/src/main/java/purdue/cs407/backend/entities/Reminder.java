package purdue.cs407.backend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import purdue.cs407.backend.dtos.ReminderRequest;

import java.sql.Time;
import java.time.DayOfWeek;

@Entity
@Table(name = "reminder")
public class Reminder {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "reminder_ID")
    private Long reminderID;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER) // Us
    @JoinColumn(name="user_ID")
    private User user;

    @Column(name="trigger_time")
    private Time triggerTime;

    @Column(name="message")
    private int message;

    @Column(name="trigger_days")
    private byte triggerDays;

    @Column(name = "cron", length = 20)
    private String cron;

    @Column(name = "job_ID", length = 196)
    private String jobID;


    public Reminder(User user, Time triggerTime, int message) {
        this.user = user;
        this.triggerTime = triggerTime;
        this.message = message;
        this.triggerDays = 0;
    }

    public Reminder(ReminderRequest request, User user) {
        this.user = user;
        this.triggerTime = request.getTriggerTime();
        byte trigger = 0;

        //Bitvector for storing days of week. rightmost bit = MONDAY, leftmost bit - 1 = SUNDAY
        for (byte dayOfWeek: request.getTriggerDays()) {
            byte shift = 0x01;
            byte mask = (byte) (shift << (byte) (dayOfWeek));
            trigger = (byte) (trigger | mask);
        }
        this.triggerDays = trigger;
        this.message = request.getMessage();
    }

    public Reminder(User user, ReminderRequest request, byte triggerDays, String cron, String jobID) {
        this.user = user;
        this.triggerTime = request.getTriggerTime();
        this.message = request.getMessage();
        this.triggerDays = triggerDays;
        this.cron = cron;
        this.jobID = jobID;
    }

    public Reminder(Long reminderID, User user, Time triggerTime, int message, byte triggerDays, String cron, String jobID) {
        this.reminderID = reminderID;
        this.user = user;
        this.triggerTime = triggerTime;
        this.message = message;
        this.triggerDays = triggerDays;
        this.cron = cron;
        this.jobID = jobID;
    }

    public Reminder() {

    }

    public User getUser() {
        return user;
    }

    public Time getTriggerTime() {
        return triggerTime;
    }

    public void setTriggerTime(Time triggerTime) {
        this.triggerTime = triggerTime;
    }

    public int getMessage() {
        return message;
    }

    public void setMessage(int message) {
        this.message = message;
    }

    public Long getReminderID() {
        return reminderID;
    }

    public void setReminderID(Long reminderID) {
        this.reminderID = reminderID;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public byte getTriggerDays() {
        return triggerDays;
    }

    public void setTriggerDays(byte triggerDays) {
        this.triggerDays = triggerDays;
    }

    public String getCron() {
        return cron;
    }

    public void setCron(String cron) {
        this.cron = cron;
    }

    public String getJobID() {
        return jobID;
    }

    public void setJobID(String jobID) {
        this.jobID = jobID;
    }
}

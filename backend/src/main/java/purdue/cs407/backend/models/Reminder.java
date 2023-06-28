package purdue.cs407.backend.models;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_ID")
    private User user;

    @Column(name="trigger_time")
    private Time triggerTime;

    @Column(name="message")
    private int message;

    @Column(name="trigger_days")
    private byte triggerDays;

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

        for (DayOfWeek dayOfWeek: request.getTriggerDays()) {
            byte shift = 0x01;
            byte mask = (byte) (shift << (byte) dayOfWeek.getValue());
            trigger = (byte) (trigger | mask);
        }
        this.triggerDays = trigger;
        this.message = request.getMessage();
    }

    public Reminder(Long reminderID, User user, Time triggerTime, int message, byte triggerDays) {
        this.reminderID = reminderID;
        this.user = user;
        this.triggerTime = triggerTime;
        this.message = message;
        this.triggerDays = triggerDays;
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
}

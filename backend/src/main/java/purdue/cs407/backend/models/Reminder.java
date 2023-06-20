package purdue.cs407.backend.models;

import jakarta.persistence.*;

import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "Reminder")
public class Reminder {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "reminder_ID")
    private int reminderID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_ID")
    private User user;

    @Column(name="trigger_time")
    private Timestamp triggerTime;

    @Column(name="message")
    private int message;

    public Reminder(User user, Timestamp triggerTime, int message) {
        this.user = user;
        this.triggerTime = triggerTime;
        this.message = message;
    }

    public Reminder() {

    }

    public User getUser() {
        return user;
    }

    public Timestamp getTriggerTime() {
        return triggerTime;
    }

    public void setTriggerTime(Timestamp triggerTime) {
        this.triggerTime = triggerTime;
    }

    public int getMessage() {
        return message;
    }

    public void setMessage(int message) {
        this.message = message;
    }

    public int getReminderID() {
        return reminderID;
    }
}

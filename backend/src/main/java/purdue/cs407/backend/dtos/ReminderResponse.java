package purdue.cs407.backend.dtos;

import purdue.cs407.backend.entities.Reminder;
import purdue.cs407.backend.entities.User;

import java.sql.Time;

public class ReminderResponse {

    private Time triggerTime;

    private String triggerDays;
    private int message;

    private String carrier;
    private Long reminderID;

    public ReminderResponse(Reminder reminder) {
        this.triggerTime = reminder.getTriggerTime();
        StringBuilder triggerDays = new StringBuilder();

        byte days = reminder.getTriggerDays();
        byte mask = 0b00000001;
        for (int i = 0; i < 7 ; i++) {
            if ((days & mask) != 0) {
                triggerDays.append("🔔");
            } else {
                triggerDays.append("🔕");
            }
            mask = (byte) (mask << 1);
        }
        this.triggerDays = triggerDays.toString();
        this.message = reminder.getMessage();
        this.carrier = reminder.getCarrier();
        this.reminderID = reminder.getReminderID();
    }

    public Time getTriggerTime() {
        return triggerTime;
    }

    public void setTriggerTime(Time triggerTime) {
        this.triggerTime = triggerTime;
    }

    public String getTriggerDays() {
        return triggerDays;
    }

    public void setTriggerDays(String triggerDays) {
        this.triggerDays = triggerDays;
    }

    public int getMessage() {
        return message;
    }

    public void setMessage(int message) {
        this.message = message;
    }

    public String getCarrier() {
        return carrier;
    }

    public void setCarrier(String carrier) {
        this.carrier = carrier;
    }

    public Long getReminderID() {
        return reminderID;
    }

    public void setReminderID(Long reminderID) {
        this.reminderID = reminderID;
    }
}

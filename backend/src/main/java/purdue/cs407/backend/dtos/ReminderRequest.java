package purdue.cs407.backend.dtos;

import java.sql.Time;
import java.time.DayOfWeek;
import java.util.List;

public class ReminderRequest {

    private List<Byte> triggerDays;

    private Time triggerTime;

    private int message;

    public ReminderRequest(List<Byte> triggerDays, Time triggerTime, int message) {
        this.triggerDays = triggerDays;
        this.triggerTime = triggerTime;
        this.message = message;
    }

    public ReminderRequest(){}

    public List<Byte> getTriggerDays() {
        return triggerDays;
    }

    public void setTriggerDays(List<Byte> triggerDays) {
        this.triggerDays = triggerDays;
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

    // days of week, time, message

}

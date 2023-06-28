package purdue.cs407.backend.dtos;

import java.sql.Time;
import java.time.DayOfWeek;
import java.util.List;

public class ReminderRequest {

    private List<DayOfWeek> triggerDays;

    private Time triggerTime;

    private int message;

    public ReminderRequest(List<DayOfWeek> triggerDays, Time triggerTime, int message) {
        this.triggerDays = triggerDays;
        this.triggerTime = triggerTime;
        this.message = message;
    }

    public ReminderRequest(){}

    public List<DayOfWeek> getTriggerDays() {
        return triggerDays;
    }

    public void setTriggerDays(List<DayOfWeek> triggerDays) {
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

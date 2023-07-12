package purdue.cs407.backend.dtos;

import java.sql.Time;
import java.util.List;

public class ReminderRequest {

    private List<Byte> triggerDays;

    private Time triggerTime;

    private int message;

    private String carrier;

    private byte timezone;

    public ReminderRequest(List<Byte> triggerDays, Time triggerTime, int message, String carrier, byte timezone) {
        this.triggerDays = triggerDays;
        this.triggerTime = triggerTime;
        this.message = message;
        this.carrier = carrier;
        this.timezone = timezone;
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

    public String getCarrier() {
        return carrier;
    }

    public void setCarrier(String carrier) {
        this.carrier = carrier;
    }

    public byte getTimezone() {
        return timezone;
    }

    public void setTimezone(byte timezone) {
        this.timezone = timezone;
    }

    // days of week, time, message

}

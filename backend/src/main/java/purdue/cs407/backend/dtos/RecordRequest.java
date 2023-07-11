package purdue.cs407.backend.dtos;

import java.sql.Date;
import java.sql.Time;

public class RecordRequest {

    private Date date;

    private Time downTime;

    private int fallTime;

    private Time sleepTime;

    private Time wakeTime;

    private int awakeTime;

    private Time upTime;

    private int quality;

    public RecordRequest(Date date, Time downTime, int fallTime, Time sleepTime, Time wakeTime, int awakeTime,
                         Time upTime, int quality) {
        this.date = date;
        this.downTime = downTime;
        this.fallTime = fallTime;
        this.sleepTime = sleepTime;
        this.wakeTime = wakeTime;
        this.awakeTime = awakeTime;
        this.upTime = upTime;
        this.quality = quality;
    }

    public RecordRequest(){}

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

    public Time getUpTime() {
        return upTime;
    }

    public void setUpTime(Time upTime) {
        this.upTime = upTime;
    }
}

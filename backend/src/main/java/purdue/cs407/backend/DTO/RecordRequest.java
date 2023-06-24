package purdue.cs407.backend.DTO;

import java.sql.Date;
import java.sql.Time;

public class RecordRequest {

    private Date date;

    // Users falling time in minutes
    private int fallingTime;

    // Users sleeptime in hours
    private double sleepTime;

    private int wakeUpCount;

    // Time user went to sleep
    private Time downTime;

    // Time user woke up
    private Time upTime;

    private int restlessness;

    private String dreams;

    public RecordRequest(Date date, int fallingTime, double sleepTime, int wakeUpCount, Time downTime, Time upTime,
                         int restlessness, String dreams) {
        this.date = date;
        this.fallingTime = fallingTime;
        this.sleepTime = sleepTime;
        this.wakeUpCount = wakeUpCount;
        this.downTime = downTime;
        this.upTime = upTime;
        this.restlessness = restlessness;
        this.dreams = dreams;
    }

    public int getFallingTime() {
        return fallingTime;
    }

    public void setFallingTime(int fallingTime) {
        this.fallingTime = fallingTime;
    }

    public double getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(double sleepTime) {
        this.sleepTime = sleepTime;
    }

    public int getWakeUpCount() {
        return wakeUpCount;
    }

    public void setWakeUpCount(int wakeUpCount) {
        this.wakeUpCount = wakeUpCount;
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

    public int getRestlessness() {
        return restlessness;
    }

    public void setRestlessness(int restlessness) {
        this.restlessness = restlessness;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDreams() {
        return dreams;
    }

    public void setDreams(String dreams) {
        this.dreams = dreams;
    }
}

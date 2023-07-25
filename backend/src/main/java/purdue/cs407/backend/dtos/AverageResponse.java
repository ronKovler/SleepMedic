package purdue.cs407.backend.dtos;

import java.sql.Time;

public class AverageResponse {

    // Avg time user gets into bed
    private Time downTime;
    // Avg time user gets out of bed
    private Time upTime;
    // Avg time user slept
    private double hoursSlept;
    // Avg time user spent falling asleep
    private int fallTime;
    // Avg time user woke up
    private Time wakeTime;
    // Avg time user fell asleep
    private Time sleepTime;
    // Avg quality of sleep
    private double quality;
    // Avg time awake in the night
    private int awakeTime;
    // Avg efficiency of sleep
    private double efficiency;

    public AverageResponse() {
        this.fallTime = -1;
        this.sleepTime = null;
        this.wakeTime = null;
        this.downTime = null;
        this.upTime = null;
        this.quality = -1;
        this.awakeTime = -1;
        this.hoursSlept = -1;
        this.efficiency = -1;
    }

    public AverageResponse(Time downTime, Time upTime, double hoursSlept, int fallTime,
                           Time wakeTime, Time sleepTime, double quality, int awakeTime, double efficiency) {
        this.downTime = downTime;
        this.upTime = upTime;
        this.hoursSlept = hoursSlept;
        this.fallTime = fallTime;
        this.wakeTime = wakeTime;
        this.sleepTime = sleepTime;
        this.quality = quality;
        this.awakeTime = awakeTime;
        this.efficiency = efficiency;
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

    public double getHoursSlept() {
        return hoursSlept;
    }

    public void setHoursSlept(double hoursSlept) {
        this.hoursSlept = hoursSlept;
    }

    public int getFallTime() {
        return fallTime;
    }

    public void setFallTime(int fallTime) {
        this.fallTime = fallTime;
    }

    public Time getWakeTime() {
        return wakeTime;
    }

    public void setWakeTime(Time wakeTime) {
        this.wakeTime = wakeTime;
    }

    public Time getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(Time sleepTime) {
        this.sleepTime = sleepTime;
    }

    public double getQuality() {
        return quality;
    }

    public void setQuality(double quality) {
        this.quality = quality;
    }

    public int getAwakeTime() {
        return awakeTime;
    }

    public void setAwakeTime(int awakeTime) {
        this.awakeTime = awakeTime;
    }

    public double getEfficiency() {
        return efficiency;
    }

    public void setEfficiency(double efficiency) {
        this.efficiency = efficiency;
    }
}

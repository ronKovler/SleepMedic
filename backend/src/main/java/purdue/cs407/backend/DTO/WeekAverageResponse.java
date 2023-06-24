package purdue.cs407.backend.DTO;

import java.sql.Time;

public class WeekAverageResponse {
    private int fallingTime;
    private double sleepTime;
    private int wakeUpCount;
    private Time downTime;
    private Time upTime;

    private int restlessness;

    public WeekAverageResponse(int fallingTime, double sleepTime, int wakeUpCount, Time downTime, Time upTime, int restlessness) {
        this.fallingTime = fallingTime;
        this.sleepTime = sleepTime;
        this.wakeUpCount = wakeUpCount;
        this.downTime = downTime;
        this.upTime = upTime;
        this.restlessness = restlessness;
    }

    public WeekAverageResponse() {
        this.fallingTime = -1;
        this.sleepTime = -1;
        this.wakeUpCount = -1;
        this.downTime = null;
        this.upTime = null;
        this.restlessness = -1;
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
}

package purdue.cs407.backend.dtos;

import java.sql.Time;

public class WeekAverageResponse {

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

    public WeekAverageResponse() {
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

    public WeekAverageResponse(Time downTime, Time upTime, double hoursSlept, int fallTime,
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
}

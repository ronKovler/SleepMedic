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

    private boolean physicalActivity;

    private boolean naps;

    private boolean caffeineConsumption;

    private boolean alcoholConsumption;

    private boolean electronics;

    private boolean difficultStayingAsleep;

    private boolean difficultFallingAsleep;

    private boolean racingThoughts;

    private String dreams;

    public RecordRequest(Date date, Time downTime, int fallTime, Time sleepTime, Time wakeTime, int awakeTime,
                         Time upTime, int quality, boolean physicalActivity, boolean naps, boolean caffeineConsumption,
                         boolean alcoholConsumption, boolean electronics, boolean difficultStayingAsleep,
                         boolean difficultFallingAsleep, boolean racingThoughts, String dreams) {
        this.date = date;
        this.downTime = downTime;
        this.fallTime = fallTime;
        this.sleepTime = sleepTime;
        this.wakeTime = wakeTime;
        this.awakeTime = awakeTime;
        this.upTime = upTime;
        this.quality = quality;
        this.physicalActivity = physicalActivity;
        this.naps = naps;
        this.caffeineConsumption = caffeineConsumption;
        this.alcoholConsumption = alcoholConsumption;
        this.electronics = electronics;
        this.difficultStayingAsleep = difficultStayingAsleep;
        this.difficultFallingAsleep = difficultFallingAsleep;
        this.racingThoughts = racingThoughts;
        this.dreams = dreams;
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

    public boolean isPhysicalActivity() {
        return physicalActivity;
    }

    public void setPhysicalActivity(boolean physicalActivity) {
        this.physicalActivity = physicalActivity;
    }

    public boolean isNaps() {
        return naps;
    }

    public void setNaps(boolean naps) {
        this.naps = naps;
    }

    public boolean isCaffeineConsumption() {
        return caffeineConsumption;
    }

    public void setCaffeineConsumption(boolean caffeineConsumption) {
        this.caffeineConsumption = caffeineConsumption;
    }

    public boolean isAlcoholConsumption() {
        return alcoholConsumption;
    }

    public void setAlcoholConsumption(boolean alcoholConsumption) {
        this.alcoholConsumption = alcoholConsumption;
    }

    public boolean isElectronics() {
        return electronics;
    }

    public void setElectronics(boolean electronics) {
        this.electronics = electronics;
    }

    public boolean isDifficultStayingAsleep() {
        return difficultStayingAsleep;
    }

    public void setDifficultStayingAsleep(boolean difficultStayingAsleep) {
        this.difficultStayingAsleep = difficultStayingAsleep;
    }

    public boolean isDifficultFallingAsleep() {
        return difficultFallingAsleep;
    }

    public void setDifficultFallingAsleep(boolean difficultFallingAsleep) {
        this.difficultFallingAsleep = difficultFallingAsleep;
    }

    public boolean isRacingThoughts() {
        return racingThoughts;
    }

    public void setRacingThoughts(boolean racingThoughts) {
        this.racingThoughts = racingThoughts;
    }

    public String getDreams() {
        return dreams;
    }

    public void setDreams(String dreams) {
        this.dreams = dreams;
    }
}

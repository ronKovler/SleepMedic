package purdue.cs407.backend.dtos;

import purdue.cs407.backend.entities.SleepRecord;

import java.sql.Date;

public class RecordResponse {

    private Long recordID;

    private Date date;

    private double downTime;

    private int fallTime;

    private double sleepTime;

    private double wakeTime;

    private int awakeTime;

    private double upTime;

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

    private double efficiency;

    public RecordResponse(Long recordID, Date date, double downTime, int fallTime, double sleepTime, double wakeTime, int awakeTime,
                          double upTime, int quality, boolean physicalActivity, boolean naps, boolean caffeineConsumption,
                          boolean alcoholConsumption, boolean electronics, boolean difficultStayingAsleep,
                          boolean difficultFallingAsleep, boolean racingThoughts, String dreams, double efficiency) {
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
        this.efficiency = efficiency;
    }

    public RecordResponse(SleepRecord r) {
        this.recordID = r.getRecordID();
        this.date = r.getDate();
        String[] downTemp = r.getDownTime().toString().split(":");
        this.downTime = Integer.parseInt(downTemp[0]) + (Double.parseDouble(downTemp[1]) / 60.0);
        this.fallTime = r.getFallTime();
        String[] sleepTemp = r.getSleepTime().toString().split(":");
        this.sleepTime = Integer.parseInt(sleepTemp[0]) + (Double.parseDouble(sleepTemp[1]) / 60.0);
        String[] wakeTemp = r.getWakeTime().toString().split(":");
        this.wakeTime = Integer.parseInt(wakeTemp[0]) + (Double.parseDouble(wakeTemp[1]) / 60.0);
        this.awakeTime = r.getAwakeTime();
        String[] upTemp = r.getUpTime().toString().split(":");
        this.upTime = Integer.parseInt(upTemp[0]) + (Double.parseDouble(upTemp[1]) / 60.0);
        this.quality = r.getQuality();
        this.physicalActivity = (r.getJournal() & (byte) 0b10000000) != 0;
        this.naps = (r.getJournal() & 0b01000000) != 0;
        this.caffeineConsumption = (r.getJournal() & 0b00100000) != 0;
        this.alcoholConsumption = (r.getJournal() & 0b00010000) != 0;
        this.electronics = (r.getJournal() & 0b00001000) != 0;
        this.difficultStayingAsleep = (r.getJournal() & 0b00000100) != 0;
        this.difficultFallingAsleep = (r.getJournal() & 0b00000010) != 0;
        this.racingThoughts = (r.getJournal() & 0b00000001) != 0;
        this.dreams = r.getDreams();
        this.efficiency = r.getEfficiency();
    }

    public RecordResponse() {}

    public Long getRecordID() {
        return recordID;
    }

    public void setRecordID(Long recordID) {
        this.recordID = recordID;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public double getDownTime() {
        return downTime;
    }

    public void setDownTime(double downTime) {
        this.downTime = downTime;
    }

    public int getFallTime() {
        return fallTime;
    }

    public void setFallTime(int fallTime) {
        this.fallTime = fallTime;
    }

    public double getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(double sleepTime) {
        this.sleepTime = sleepTime;
    }

    public double getWakeTime() {
        return wakeTime;
    }

    public void setWakeTime(double wakeTime) {
        this.wakeTime = wakeTime;
    }

    public int getAwakeTime() {
        return awakeTime;
    }

    public void setAwakeTime(int awakeTime) {
        this.awakeTime = awakeTime;
    }

    public double getUpTime() {
        return upTime;
    }

    public void setUpTime(double upTime) {
        this.upTime = upTime;
    }

    public int getQuality() {
        return quality;
    }

    public void setQuality(int quality) {
        this.quality = quality;
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

    public double getEfficiency() {
        return efficiency;
    }

    public void setEfficiency(double efficiency) {
        this.efficiency = efficiency;
    }
}
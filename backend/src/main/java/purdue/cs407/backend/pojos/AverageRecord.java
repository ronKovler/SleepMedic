package purdue.cs407.backend.pojos;

import purdue.cs407.backend.entities.SleepRecord;

import java.util.List;

public class AverageRecord {
    private double hoursSlept;
    private long downTime;
    private long upTime;
    private long sleepTime;
    private long wakeTime;
    private int awakeTime;
    private int fallTime;
    private double quality;
    private double efficiency;
    private double[] journal;

    public AverageRecord(double hoursSlept, long downTime, long upTime, long sleepTime, long wakeTime, int awakeTime,
                         int fallTime, double quality, double efficiency, double[] journal) {
        this.hoursSlept = hoursSlept;
        this.downTime = downTime;
        this.upTime = upTime;
        this.sleepTime = sleepTime;
        this.wakeTime = wakeTime;
        this.awakeTime = awakeTime;
        this.fallTime = fallTime;
        this.quality = quality;
        this.efficiency = efficiency;
        this.journal = journal;
    }

    public AverageRecord(List<SleepRecord> records) {
        this.hoursSlept = 0;
        this.downTime = 0;
        this.upTime = 0;
        this.sleepTime = 0;
        this.wakeTime = 0;
        this.awakeTime = 0;
        this.fallTime = 0;
        this.quality = 0;
        this.efficiency = 0;
        this.journal = new double[8]; // Java should initialize to array of 0's

        this.averageData(records);
        this.normalize(records.size());
    }

    public void averageData(List<SleepRecord> records) {
        records.forEach(this::addRecord);
    }

    public void addRecord(SleepRecord record) {
        this.hoursSlept += record.hoursSlept();
        this.downTime += record.getDownTime();
        this.upTime += record.getUpTime();
        this.sleepTime += record.getSleepTime();
        this.wakeTime += record.getWakeTime();
        this.awakeTime += record.getAwakeTime();
        this.fallTime += record.getFallTime();
        this.quality += record.getQuality();
        this.efficiency += record.getEfficiency();

        byte j = record.getJournal();
        if ((j & 0b10000000) != 0) this.journal[0]++;
        if ((j & 0b01000000) != 0) this.journal[1]++;
        if ((j & 0b00100000) != 0) this.journal[2]++;
        if ((j & 0b00010000) != 0) this.journal[3]++;
        if ((j & 0b00001000) != 0) this.journal[4]++;
        if ((j & 0b00000100) != 0) this.journal[5]++;
        if ((j & 0b00000010) != 0) this.journal[6]++;
        if ((j & 0b00000001) != 0) this.journal[7]++;
    }

    public void normalize(int count) {
        this.hoursSlept /= count;
        this.downTime /= count;
        this.upTime /= count;
        this.sleepTime /= count;
        this.wakeTime /= count;
        this.awakeTime /= count;
        this.fallTime /= count;
        this.quality /= count;
        this.efficiency /= count;
        for (int i = 0; i < this.journal.length; i++) {
            this.journal[i] /= count;
        }
    }

    public double getHoursSlept() {
        return hoursSlept;
    }

    public void setHoursSlept(double hoursSlept) {
        this.hoursSlept = hoursSlept;
    }

    public long getDownTime() {
        return downTime;
    }

    public void setDownTime(long downTime) {
        this.downTime = downTime;
    }

    public long getUpTime() {
        return upTime;
    }

    public void setUpTime(long upTime) {
        this.upTime = upTime;
    }

    public long getSleepTime() {
        return sleepTime;
    }

    public void setSleepTime(long sleepTime) {
        this.sleepTime = sleepTime;
    }

    public long getWakeTime() {
        return wakeTime;
    }

    public void setWakeTime(long wakeTime) {
        this.wakeTime = wakeTime;
    }

    public int getAwakeTime() {
        return awakeTime;
    }

    public void setAwakeTime(int awakeTime) {
        this.awakeTime = awakeTime;
    }

    public int getFallTime() {
        return fallTime;
    }

    public void setFallTime(int fallTime) {
        this.fallTime = fallTime;
    }

    public double getQuality() {
        return quality;
    }

    public void setQuality(double quality) {
        this.quality = quality;
    }

    public double getEfficiency() {
        return efficiency;
    }

    public void setEfficiency(double efficiency) {
        this.efficiency = efficiency;
    }

    public double[] getJournal() {
        return journal;
    }

    public void setJournal(double[] journal) {
        this.journal = journal;
    }
}

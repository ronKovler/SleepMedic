package purdue.cs407.backend.pojos;


import purdue.cs407.backend.entities.Reminder;

public class ReminderTask {

    private String cronExpression;
    private Reminder reminder;

    public ReminderTask(String cronExpression, Reminder reminder) {
        this.cronExpression = cronExpression;
        this.reminder = reminder;
    }
    public ReminderTask() {

    }

    public String getCronExpression() {
        return cronExpression;
    }

    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    public Reminder getReminder() {
        return reminder;
    }

    public void setReminder(Reminder reminder) {
        this.reminder = reminder;
    }

}

package purdue.cs407.backend.pojos;


public class TaskDefinition {

    private String cronExpression;
    private String actionType;
    private String data;

    public TaskDefinition(String cronExpression, String actionType, String data) {
        this.cronExpression = cronExpression;
        this.actionType = actionType;
        this.data = data;
    }
    public TaskDefinition() {

    }

    public String getCronExpression() {
        return cronExpression;
    }

    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }
}

package purdue.cs407.backend.dtos;

public class InfoResponse {
    private String firstName;
    private String lastName;

    private double progress;

    public InfoResponse(String firstName, String lastName, double progress) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.progress = progress;
    }

    public InfoResponse(){}

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public double getProgress() {
        return progress;
    }

    public void setProgress(double progress) {
        this.progress = progress;
    }
}

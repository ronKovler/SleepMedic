package purdue.cs407.backend.dtos;

import java.util.List;

public class InfoResponse {
    private String firstName;
    private String lastName;

    private double progress;

    private List<AdviceResponse> advice;

    public InfoResponse(String firstName, String lastName, double progress, List<AdviceResponse> advice) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.progress = progress;
        this.advice = advice;
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

    public List<AdviceResponse> getAdvice() {
        return advice;
    }

    public void setAdvice(List<AdviceResponse> advice) {
        this.advice = advice;
    }
}

package purdue.cs407.backend.dtos;

public class InfoResponse {
    private String firstName;
    private String lastName;

    public InfoResponse(String firstName, String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
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
}

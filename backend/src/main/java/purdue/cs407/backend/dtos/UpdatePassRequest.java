package purdue.cs407.backend.dtos;

public class UpdatePassRequest {
    String password;

    public UpdatePassRequest(String password) {
        this.password = password;
    }

    public UpdatePassRequest(){}

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

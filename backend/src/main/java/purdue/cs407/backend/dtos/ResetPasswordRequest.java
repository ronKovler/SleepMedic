package purdue.cs407.backend.dtos;

import java.sql.Date;

public class ResetPasswordRequest {

    private String email;
    private Date birthday;

    public ResetPasswordRequest(String email, Date birthday) {
        this.email = email;
        this.birthday = birthday;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthYear) {
        this.birthday = birthYear;
    }
}

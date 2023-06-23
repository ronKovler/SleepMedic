package purdue.cs407.backend.models;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import purdue.cs407.backend.DTO.RegisterRequest;

import java.sql.Date;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "user")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "user_ID")
    /* TABLE indicates that the persistence provider must assign primary keys
    for the entity using an underlying database table to ensure uniqueness */
    private Long userID;

    @Column(name="first_name", length=64)
    private String firstName;

    @Column(name="last_name", length=64)
    private String lastName;

    @Column(name="email", length=128, unique=true)
    private String email;

    @Column(name="password", length=64)
    private String password;

    @Column(name="birthday")
    private Date birthday;

    @Column(name="sex", length=1)
    private String sex;


    public User(String firstName, String lastName, String email, String password, Date birthday, String sex) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.birthday = birthday;
        this.sex = sex;
    }

    public User(RegisterRequest request) {
        this.firstName = request.getFirstName();
        this.lastName = request.getLastName();
        this.email = request.getEmail();
        this.password = request.getPassword();
        this.birthday = request.getBirthday();
        this.sex = request.getSex();
    }

    public User() {

    }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLL_USER"));
    }

//    public String getPassword() {
//        return password;
//    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Long getUserID() {
        return userID;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }



}

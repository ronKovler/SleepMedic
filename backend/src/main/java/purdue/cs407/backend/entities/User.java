package purdue.cs407.backend.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.Cascade;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import purdue.cs407.backend.dtos.RegisterRequest;

import java.sql.Date;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @Column(name="phone", length=12, unique = true)
    private String phone;

    @Column(name="password", length=60)
    private String password;

    @Column(name="birthday")
    private Date birthday;

    @Column(name="sex", length=1)
    private String sex;

    /**
     * Byte representing week and day number. First 4 bits week number, second 4 bits day number
     */
    @Column(name="education_progress")
    private byte educationProgress;


    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Cascade(org.hibernate.annotations.CascadeType.DELETE)
    private Set<SleepRecord> records = new HashSet<>();
    //@Cascade(value = )
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @Cascade(org.hibernate.annotations.CascadeType.DELETE)
    private Set<Reminder> reminders = new HashSet<>();


    public User(String firstName, String lastName, String email, String password, Date birthday, String sex,
                byte educationProgress) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.birthday = birthday;
        this.sex = sex;
        this.educationProgress = educationProgress;
    }

    public User(Long userID, String firstName, String lastName, String email, String password, Date birthday,
                String sex, byte educationProgress) {
        this.userID = userID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.birthday = birthday;
        this.sex = sex;
        this.educationProgress = educationProgress;
    }

    public User(RegisterRequest request) {
        this.firstName = request.getFirstName();
        this.lastName = request.getLastName();
        this.email = request.getEmail().toLowerCase();
        this.phone = request.getPhone();
        this.password = request.getPassword();
        this.birthday = request.getBirthday();
        this.sex = request.getSex();
        this.educationProgress = 0b00000000;
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
        return password;
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

    public void setUserID(Long userID) {
        this.userID = userID;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public byte getEducationProgress() {
        return educationProgress;
    }

    public void setEducationProgress(byte educationProgress) {
        this.educationProgress = educationProgress;
    }

    public Set<SleepRecord> getRecords() {
        return records;
    }

    public void setRecords(Set<SleepRecord> records) {
        this.records = records;
    }

    public Set<Reminder> getReminders() {
        return reminders;
    }

    public void setReminders(Set<Reminder> reminders) {
        this.reminders = reminders;
    }

    public void addReminder(Reminder reminder) {
        this.reminders.add(reminder);
    }

    public void removeReminder(Reminder reminder) {
        this.reminders.remove(reminder);
    }

    public void addRecord(SleepRecord record) {
        this.records.add(record);
    }

    public void removeRecord(SleepRecord record) {
        this.records.remove(record);
    }

    @Override
    public boolean equals(Object o) {
        if (o == this) {
            return true;
        }
        if (!(o instanceof User u)) {
            return false;
        }

        return u.getUserID().equals(this.getUserID());
    }

}

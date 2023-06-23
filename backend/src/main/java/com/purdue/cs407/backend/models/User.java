//package com.purdue.cs407.backend.models;
//
//import jakarta.persistence.*;
//
//import java.sql.Date;
//
//@Entity
//@Table(name = "User")
//public class User {
//
//    @Id
//    @GeneratedValue(strategy= GenerationType.IDENTITY)
//    @Column(name = "user_ID")
//    /* TABLE indicates that the persistence provider must assign primary keys
//    for the entity using an underlying database table to ensure uniqueness */
//    private int userID;
//
//    @Column(name="first_name", length=64)
//    private int firstName;
//
//    @Column(name="last_name", length=64)
//    private String lastName;
//
//    @Column(name="email", length=128, unique=true)
//    private String email;
//
//    @Column(name="password", length=64)
//    private String password;
//
//    @Column(name="birthday")
//    private Date birthday;
//
//    @Column(name="sex", length=1)
//    private String sex;
//
//
//    public User(int firstName, String lastName, String email, String password, Date birthday, String sex) {
//        this.firstName = firstName;
//        this.lastName = lastName;
//        this.email = email;
//        this.password = password;
//        this.birthday = birthday;
//        this.sex = sex;
//    }
//
//    public User() {
//
//    }
//
//    public int getFirstName() {
//        return firstName;
//    }
//
//    public void setFirstName(int firstName) {
//        this.firstName = firstName;
//    }
//
//    public String getLastName() {
//        return lastName;
//    }
//
//    public void setLastName(String lastName) {
//        this.lastName = lastName;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//
//    public int getUserID() {
//        return userID;
//    }
//
//
//}

//package com.purdue.cs407.backend.models;
//
//import jakarta.persistence.*;
//
//import java.sql.Date;
//import java.sql.Time;
//
//@Entity
//@Table(name = "Goal")
//public class Goal {
//    @Id
//    @GeneratedValue(strategy= GenerationType.IDENTITY)
//    @Column(name = "goal_ID")
//    private int goalID;
//
//    @Column(name="sleep_time")
//    private int sleepTime;
//
//    @Column(name="falling_time")
//    private String fallingTime;
//
//    @OneToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name="user_ID")
//    private User user;
//
//    @Column(name="down_time")
//    private Time downTime;
//
//    @Column(name="up_time")
//    private Time upTime;
//
//    @Column(name="restlessness")
//    private int restlessness;
//
//    public Goal(int sleepTime, String fallingTime, User user, Time downTime, Time upTime, int restlessness) {
//        this.sleepTime = sleepTime;
//        this.fallingTime = fallingTime;
//        this.user = user;
//        this.downTime = downTime;
//        this.upTime = upTime;
//        this.restlessness = restlessness;
//    }
//
//    public Goal() {
//
//    }
//
//    public int getSleepTime() {
//        return sleepTime;
//    }
//
//    public void setSleepTime(int sleepTime) {
//        this.sleepTime = sleepTime;
//    }
//
//    public String getFallingTime() {
//        return fallingTime;
//    }
//
//    public void setFallingTime(String fallingTime) {
//        this.fallingTime = fallingTime;
//    }
//
//    public User getUser() {
//        return user;
//    }
//
//    public Time getDownTime() {
//        return downTime;
//    }
//
//    public void setDownTime(Time downTime) {
//        this.downTime = downTime;
//    }
//
//    public Time getUpTime() {
//        return upTime;
//    }
//
//    public void setUpTime(Time upTime) {
//        this.upTime = upTime;
//    }
//
//    public int getRestlessness() {
//        return restlessness;
//    }
//
//    public void setRestlessness(int restlessness) {
//        this.restlessness = restlessness;
//    }
//}

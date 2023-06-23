//package com.purdue.cs407.backend.repositories;
//
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.stereotype.Repository;
//
//import com.purdue.cs407.backend.models.User;
//
//@Repository
//public interface UserRepository extends JpaRepository<User, Integer> {
//
//    User findByEmailEquals(String email);
//
//    User findByEmailEqualsAndPasswordEquals(String email, String password);
//    User findByUserID(int userID);
//    User findByUserIDEquals(int userID);
//    User getByUserID(int userID);
//
//
//
//
//}
//package com.purdue.cs407.backend.controllers;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import com.purdue.cs407.backend.models.User;
//import com.purdue.cs407.backend.repositories.UserRepository;
//
//import java.net.URISyntaxException;
//
//@RestController
//@RequestMapping("/api/account/")
//@CrossOrigin
//public class AccountController {
//    @Autowired  // Autowired annotation automatically injects an instance
//    private UserRepository userRepository;
//
//
//    /**
//     * Create account API
//     * @param newUser
//     * @return
//     * @throws URISyntaxException
//     */
//    @RequestMapping(value="create_account", method = RequestMethod.POST,
//            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<Integer> createAccount(@RequestBody User newUser) throws URISyntaxException {
//        HttpHeaders responseHeaders = new HttpHeaders();
//
//        // Ensure email is not already in use
//        User checkExists = userRepository.findByEmailEquals(newUser.getEmail());
//        if (checkExists != null) {
//            System.out.println("Email already used: " + checkExists.getEmail());
//            return ResponseEntity.ok().headers(responseHeaders).body(-1);
//        }
//
//        // Saves user to database
//        userRepository.save(newUser);
//
//        return ResponseEntity.ok().headers(responseHeaders).body(newUser.getUserID());
//    }
//}

package purdue.cs407.backend.controllers;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import purdue.cs407.backend.dtos.RecordRequest;
import purdue.cs407.backend.entities.SleepRecord;
import purdue.cs407.backend.entities.User;
import purdue.cs407.backend.repositories.RecordRepository;
import purdue.cs407.backend.repositories.UserRepository;

import java.util.Optional;

public class UserController {

    private final UserRepository userRepository;
    private final RecordRepository recordRepository;

    public UserController(UserRepository userRepository, RecordRepository recordRepository) {
        this.userRepository = userRepository;
        this.recordRepository = recordRepository;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    /**
     * Delete User Account
     */
    @RequestMapping(value = "delete_account", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteAccount(@PathVariable("user_Id") Long userId) {
        Optional<User> optionalUser = userRepository.findById(userId);

        // User with the given userId does not exist
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).build();
        }

        User user = optionalUser.get();

        // Delete associated records using cascade delete
        recordRepository.deleteByUser(user);

        // Now delete the user account
        userRepository.delete(user);

        return ResponseEntity.ok("Account deleted successfully");
    }


    /**
     * Update User sleep record (already existing record)
     */
    @RequestMapping(value = "update_record/{recordId}", method = RequestMethod.PUT,
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updateRecord(@PathVariable("recordId") Long recordId,
                                               @RequestBody RecordRequest request) {
        User currentUser = getCurrentUser();

        Optional<SleepRecord> optionalRecord = recordRepository.findById(recordId);
        if (optionalRecord.isEmpty()) {
            // does not exist
            return ResponseEntity.status(404).build();
        }

        SleepRecord record = optionalRecord.get();

        // In a case were user does not have permission to update the record
        if (!record.getUser().equals(currentUser)) {
            return ResponseEntity.status(403).build();
        }

        // Now we can update the record with the new data
        record.setDate(request.getDate());
        record.setSleepTime(request.getSleepTime());

        recordRepository.save(record);

        return ResponseEntity.ok("Record updated successfully");
    }
}

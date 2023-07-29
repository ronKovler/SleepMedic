package purdue.cs407.backend.controllers;


import jakarta.mail.MessagingException;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import purdue.cs407.backend.dtos.*;
import purdue.cs407.backend.entities.SleepRecord;
import purdue.cs407.backend.entities.User;
import purdue.cs407.backend.pojos.EmailDetails;
import purdue.cs407.backend.repositories.RecordRepository;
import purdue.cs407.backend.repositories.ReminderRepository;
import purdue.cs407.backend.repositories.UserRepository;
import purdue.cs407.backend.services.AuthService;
import purdue.cs407.backend.services.EmailService;
import java.io.FileNotFoundException;
import java.util.Collection;

@RestController
@RequestMapping("/account/")
@CrossOrigin(origins = "*")
public class AccountController {

    private final UserRepository userRepository;
    private final RecordRepository recordRepository;

    private final ReminderRepository reminderRepository;
    private final AuthService authService;
    private final EmailService emailService;


    public AccountController(UserRepository userRepository, RecordRepository recordRepository,
                             AuthService authService, EmailService emailService,
                             ReminderRepository reminderRepository) {
        this.userRepository = userRepository;
        this.recordRepository = recordRepository;
        this.authService = authService;
        this.emailService = emailService;
        this.reminderRepository = reminderRepository;
    }

    /**
     * Helper method to view current user from session.
     * @return - User of current session.
     */
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    /**
     * Create a new user account by request
     * @param request - user information to make new account.
     * @return - JWT token of newly created account
     */
    @RequestMapping(value="auth/create_account", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> createAccount(@RequestBody RegisterRequest request) {

        System.out.println("NEW ACCOUNT F:" + request.getFirstName() + " L:" + request.getLastName() + " E:" +
                request.getEmail() + " P:" + request.getPassword());

        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Login pathway
     * @param request - credentials to login: email and password
     * @return - JWT token if credentials match
     */
    @RequestMapping(value="auth/login", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {

        System.out.println("NEW LOGIN ATTEMPT E:" + request.getEmail() + " P:" + request.getPassword());

        return ResponseEntity.ok(authService.authenticate(request));
    }

    //TODO ADD INJECTION CHECKING FOR FOLLOWING 2 METHODS
    /**
     * Check if we can make an account with the given email
     * @param email - Email to check
     * @return - True if its free, false if not
     */
    @RequestMapping(value="auth/check_email/{email}", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> checkEmail(@PathVariable String email) {

        System.out.println("Checking if email exists by request: " + email);
        Boolean exists = userRepository.existsByEmail(email.toLowerCase());

        return ResponseEntity.ok(!exists);
    }

    /**
     * Check if we can make an account with the given phone
     * @param phone - Email to check
     * @return - True if its free, false if not
     */
    @RequestMapping(value="auth/check_phone/{phone}", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> checkPhone(@PathVariable String phone) {

        System.out.println("Checking if phone exists by request: " + phone);
        Boolean exists = userRepository.existsByPhone(phone);

        return ResponseEntity.ok(!exists);
    }

    /**
     * Generate and send a new random password upon request
     * @param request - Users email and birthday of account to reset password
     * @return - nothing, we don't say if we did or not, to prevent users from attempting to gleam info
     */
    @RequestMapping(value="auth/reset_password", method = RequestMethod.PATCH,
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase()).
                orElseThrow(() ->
                        new UsernameNotFoundException("Tried to reset password for account that doesn't exist!"));

        if (request.getBirthday().equals(user.getBirthday())) {
            String password = authService.resetForgottenPassword(user);

            String template = emailService.getTemplate(4);

            String message = template.replace("{FIRST}", user.getFirstName());
            message = message.replace("{PASSWORD}", password);

            EmailDetails details = new EmailDetails(user.getEmail(), message, "SleepMedic Password Reset", null);
            emailService.sendSimpleMail(details);

        }
        return ResponseEntity.ok("");
    }

    /**
     * Update users password by request
     * @param request - The new password to be set
     * @return - AuthResponse containing new JWT token for further authentication.
     */
    @RequestMapping(value = "update_password", method = RequestMethod.PATCH,
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> updatePassword(@RequestBody UpdatePassRequest request) {
        User user = getCurrentUser();
        System.out.println("New PASSWORD: " + request.getPassword());
        return ResponseEntity.ok(authService.updatePassword(user, request.getPassword()));
    }

    @RequestMapping(value = "export_data", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Integer> exportData() throws FileNotFoundException, MessagingException {
        User user = getCurrentUser();
        Collection<SleepRecord> records = recordRepository.findAllByUserOrderByDateAsc(user);
        if (records.size() == 0) {
            return ResponseEntity.notFound().build();
        }
        String fName = user.getUserID() + ".csv";

        StringBuilder builder = new StringBuilder("Date,Got into bed,Fell asleep,Woke up,Got out of bed,Time to fall (m),Woke up for (m),Quality(1-5),Exercised?,Napped?,Consumed Caffeine?,Consumed Alcohol?,Used Electronics?,Difficult Staying Asleep?,Difficult Falling Asleep?,Had racing thoughts?,Dreams\n");
        records.forEach(e ->  builder.append(e.toString()));

        byte[] out = builder.toString().getBytes();
        EmailDetails details = new EmailDetails(user.getEmail(), "Attached is your exported data.", "SleepMedic Data Export", out);
        emailService.sendMailWithAttachment(details, fName);

        return ResponseEntity.ok(records.size());
    }

    /**
     * API to view all current reminders on the users account page.
     * @return List of
     */


    /**
     * Delete User Account
     */
    @Transactional
    @RequestMapping(value = "delete_account", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteAccount() {
        User user = getCurrentUser();

        // Delete associated records using cascade delete
        recordRepository.deleteAllByUser(user);
        // Delete reminders
        reminderRepository.deleteAllByUser(user);
        // Now delete the user account
        userRepository.delete(user);

        return ResponseEntity.ok("Account deleted successfully");
    }





}

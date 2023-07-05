package purdue.cs407.backend.controllers;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import purdue.cs407.backend.dtos.AuthRequest;
import purdue.cs407.backend.dtos.AuthResponse;
import purdue.cs407.backend.dtos.RegisterRequest;
import purdue.cs407.backend.dtos.ResetPasswordRequest;
import purdue.cs407.backend.entities.User;
import purdue.cs407.backend.pojos.EmailDetails;
import purdue.cs407.backend.repositories.UserRepository;
import purdue.cs407.backend.services.AuthService;
import purdue.cs407.backend.services.EmailService;

@RestController
@RequestMapping("/api/account/")
@CrossOrigin(origins = "*")
public class AccountController {

    private final UserRepository userRepository;
    private final AuthService authService;

    private final EmailService emailService;

    public AccountController(UserRepository userRepository, AuthService authService, EmailService emailService) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.emailService = emailService;
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }

    @RequestMapping(value="auth/create_account", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> createAccount(@RequestBody RegisterRequest request) {

        System.out.println("NEW ACCOUNT F:" + request.getFirstName() + " L:" + request.getLastName() + " E:" +
                request.getEmail() + " P:" + request.getPassword());

        return ResponseEntity.ok(authService.register(request));
    }

    @RequestMapping(value="auth/login", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {

        System.out.println("NEW LOGIN ATTEMPT E:" + request.getEmail() + " P:" + request.getPassword());

        return ResponseEntity.ok(authService.authenticate(request));
    }

    @RequestMapping(value="auth/check_email/{email}", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> checkEmail(@PathVariable String email) {

        System.out.println("Checking if email exists by request: " + email);
        Boolean exists = userRepository.existsByEmail(email.toLowerCase());

        return ResponseEntity.ok(!exists);
    }

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

    @RequestMapping(value = "update_password", method = RequestMethod.PATCH,
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> updatePassword(@RequestBody String password) {
        User user = getCurrentUser();
        return ResponseEntity.ok(authService.updatePassword(user, password));
    }



}

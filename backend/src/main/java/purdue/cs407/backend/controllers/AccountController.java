package purdue.cs407.backend.controllers;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import purdue.cs407.backend.dtos.AuthRequest;
import purdue.cs407.backend.dtos.AuthResponse;
import purdue.cs407.backend.dtos.RegisterRequest;
import purdue.cs407.backend.repositories.UserRepository;
import purdue.cs407.backend.services.AuthService;

@RestController
@RequestMapping("/api/account/")
@CrossOrigin(origins = "*")
public class AccountController {

    private final UserRepository userRepository;
    private final AuthService authService;

    public AccountController(UserRepository userRepository, AuthService authService ) {
        this.userRepository = userRepository;
        this.authService = authService;
    }



    @RequestMapping(value="create_account", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> createAccount(@RequestBody RegisterRequest request) {

        System.out.println("NEW ACCOUNT F:" + request.getFirstName() + " L:" + request.getLastName() + " E:" + request.getEmail() + " P:" + request.getPassword());

        return ResponseEntity.ok(authService.register(request));
    }

    @RequestMapping(value="login", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {

        System.out.println("NEW LOGIN ATTEMPT E:" + request.getEmail() + " P:" + request.getPassword());

        return ResponseEntity.ok(authService.authenticate(request));
    }

    @RequestMapping(value="check_email/{email}", method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Boolean> checkEmail(@PathVariable String email) {

        System.out.println("Checking if email exists by request: " + email);
        Boolean exists = userRepository.existsByEmail(email);

        return ResponseEntity.ok(!exists);
    }



}

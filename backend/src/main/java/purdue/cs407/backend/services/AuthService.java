package purdue.cs407.backend.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import purdue.cs407.backend.dtos.AuthRequest;
import purdue.cs407.backend.dtos.AuthResponse;
import purdue.cs407.backend.dtos.RegisterRequest;
import purdue.cs407.backend.entities.User;
import purdue.cs407.backend.repositories.UserRepository;

import java.util.Random;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Register a new user from the create account endpoint
     * @param request - details of new account to make
     * @return - JWT token of -1 of failure (account exists) and JWT token on success
     */
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return new AuthResponse("-1"); // Sanity check, should be handled by frontend making calls to
        }                                        // /api/account/check_email/{email}

        /* Create user and encode password */
        User user = new User(request);
        String password = request.getPassword();
        String encodedPass = passwordEncoder.encode(password);


        user.setPassword(encodedPass);
        // Save User to DB
        user = userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken);
    }

    /**
     * Authenticate a user from login endpoint
     * @param request - credentials to check
     * @return - JWT token on success.
     */
    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase(),
                        request.getPassword()
                )
        );
        // If we get here, user has been authenticated
        System.out.println("Authenticated User: " + request.getEmail());
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken);
    }

    /**
     * Resets a users password to random on request of forget password endpoint
     * @param user - Account to reset password
     * @return - New password to send in notification.
     */
    public String resetForgottenPassword(User user) {
        String password = generateTemporaryPassword();
        System.out.println("TEMP PASSWORD IS " + password);
        String encodedPass = passwordEncoder.encode(password);

        user.setPassword(encodedPass);
        userRepository.save(user);

        return password;
    }

    /**
     * Update password on request from update password endpoint
     * @param user - account to update
     * @param password - new password
     * @return - new JWT token for new credentials
     */
    public AuthResponse updatePassword(User user, String password) {
        String encodedPass = passwordEncoder.encode(password);
        user.setPassword(encodedPass);
        user = userRepository.save(user);

        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken);
    }

    private String generateTemporaryPassword() {
        String charBank = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz!@#$%^&*()_?.";
        StringBuilder password = new StringBuilder();
        Random rnd = new Random();
        while (password.length() < 18) { // length of the random string.
            int index = (int) (rnd.nextFloat() * charBank.length());
            password.append(charBank.charAt(index));
        }
        return password.toString();
    }
}

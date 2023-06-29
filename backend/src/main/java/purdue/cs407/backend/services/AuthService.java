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

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            return new AuthResponse("-1");
        }

        /* Create user and encode password */
        User user = new User(request);
        String password = request.getPassword();
        String encodedPass = passwordEncoder.encode(password);


        user.setPassword(encodedPass);
        // Save User to DB
        userRepository.save(user);
        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken);
    }

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase(),
                        request.getPassword()
                )
        );

        System.out.println("Authenticated User: " + request.getEmail());
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        String jwtToken = jwtService.generateToken(user);

        return new AuthResponse(jwtToken);
    }
}

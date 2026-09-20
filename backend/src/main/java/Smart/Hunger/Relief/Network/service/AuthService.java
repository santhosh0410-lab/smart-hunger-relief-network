package Smart.Hunger.Relief.Network.service;

import Smart.Hunger.Relief.Network.model.LoginResponse;
import Smart.Hunger.Relief.Network.security.JwtUtil;
import Smart.Hunger.Relief.Network.model.User;
import Smart.Hunger.Relief.Network.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtUtil jwtUtil) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
}

    public User registerUser(String name, String email, String password, String role) {

        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }

        if (!"DONOR".equalsIgnoreCase(role)
        && !"VOLUNTEER".equalsIgnoreCase(role)) {
            throw new RuntimeException(
            "Registration is allowed only for DONOR or VOLUNTEER");
        }


        // Create new user
        User user = new User();

        user.setName(name);
        user.setEmail(email);

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(password));

        user.setRole(role);

        return userRepository.save(user);
    }
    public LoginResponse loginUser(String email, String password) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Invalid email or password"));

    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new RuntimeException("Invalid email or password");
    }

    String token = jwtUtil.generateToken(
            user.getEmail(),
            user.getRole()
    );

    return new LoginResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            token
    );
}
}
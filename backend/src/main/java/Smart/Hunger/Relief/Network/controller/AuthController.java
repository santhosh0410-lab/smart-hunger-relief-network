package Smart.Hunger.Relief.Network.controller;

import Smart.Hunger.Relief.Network.model.LoginResponse;
import Smart.Hunger.Relief.Network.model.User;
import Smart.Hunger.Relief.Network.model.LoginRequest;
import Smart.Hunger.Relief.Network.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestParam String name,
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String role) {

        try {
            User user = authService.registerUser(
                    name,
                    email,
                    password,
                    role
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(user);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

    try {
        LoginResponse response = authService.loginUser(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        return ResponseEntity.ok(response);

    } catch (RuntimeException e) {
        return ResponseEntity
                .badRequest()
                .body(e.getMessage());
    }
}
}
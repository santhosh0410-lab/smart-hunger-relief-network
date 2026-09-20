package Smart.Hunger.Relief.Network.controller;

import Smart.Hunger.Relief.Network.model.User;
import Smart.Hunger.Relief.Network.repository.UserRepository;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/api/volunteers")
@CrossOrigin(origins = "http://localhost:5173")
public class VolunteerController {

    private final UserRepository userRepository;

    public VolunteerController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public List<User> getAllVolunteers() {
        return userRepository.findByRole("VOLUNTEER");
    }
}
package Smart.Hunger.Relief.Network.controller;

import Smart.Hunger.Relief.Network.repository.DonationRepository;
import Smart.Hunger.Relief.Network.repository.UserRepository;

import Smart.Hunger.Relief.Network.model.UserResponse;
import Smart.Hunger.Relief.Network.model.Donation;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final UserRepository userRepository;
    private final DonationRepository donationRepository;

    public AdminController(
            UserRepository userRepository,
            DonationRepository donationRepository) {

        this.userRepository = userRepository;
        this.donationRepository = donationRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Long> getDashboardStats() {

        Map<String, Long> stats = new HashMap<>();

        stats.put("totalUsers", userRepository.count());
        stats.put("totalDonors", userRepository.countByRole("DONOR"));
        stats.put("totalVolunteers", userRepository.countByRole("VOLUNTEER"));

        stats.put("totalDonations", donationRepository.count());
        stats.put("availableDonations",
                donationRepository.countByStatus("AVAILABLE"));
        stats.put("requestedDonations",
                donationRepository.countByStatus("REQUESTED"));
        stats.put("completedDonations",
                donationRepository.countByStatus("COMPLETED"));
        stats.put("totalFoodDonations",
                donationRepository.countByCategory("FOOD"));

        stats.put("totalGroceryDonations",
                donationRepository.countByCategory("GROCERY"));

        stats.put("availableFoodDonations",
                donationRepository.countByCategoryAndStatus(
                "FOOD", "AVAILABLE"));

        stats.put("availableGroceryDonations",
                donationRepository.countByCategoryAndStatus(
                "GROCERY", "AVAILABLE"));        

        return stats;
    }

    @GetMapping("/users")
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/users/donors")
    public List<UserResponse> getAllDonors() {

        return userRepository.findByRole("DONOR")
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/users/volunteers")
    public List<UserResponse> getAllVolunteers() {

        return userRepository.findByRole("VOLUNTEER")
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/donations")
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    @PutMapping("/donations/{id}/status")
    public Donation updateDonationStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        Donation donation = donationRepository.findById(id)
        .orElseThrow(() ->
                new RuntimeException("Donation not found"));

String normalizedStatus = status.toUpperCase();

if (!normalizedStatus.equals("AVAILABLE")
        && !normalizedStatus.equals("REQUESTED")
        && !normalizedStatus.equals("ACCEPTED")
        && !normalizedStatus.equals("PICKED_UP")
        && !normalizedStatus.equals("DISTRIBUTED")
        && !normalizedStatus.equals("COMPLETED")) {

    throw new RuntimeException("Invalid donation status");
}

donation.setStatus(normalizedStatus);

        return donationRepository.save(donation);
    }

}
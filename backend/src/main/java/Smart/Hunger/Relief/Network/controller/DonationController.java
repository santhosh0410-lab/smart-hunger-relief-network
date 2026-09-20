package Smart.Hunger.Relief.Network.controller;

import Smart.Hunger.Relief.Network.model.Donation;
import Smart.Hunger.Relief.Network.repository.DonationRepository;
import Smart.Hunger.Relief.Network.model.User;
import Smart.Hunger.Relief.Network.repository.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;


@RestController
@RequestMapping("/api/donations")
@CrossOrigin(origins = "http://localhost:5173")
public class DonationController {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public DonationController(
        DonationRepository donationRepository,
        UserRepository userRepository) {

    this.donationRepository = donationRepository;
    this.userRepository = userRepository;
}

    @GetMapping
    public List<Donation> getAllDonations() {
        return donationRepository.findAll();
    }

    @GetMapping("/{id}")
    public Donation getDonationById(@PathVariable Long id) {
        return donationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Donation not found"));
    }

    @GetMapping("/status/{status}")
    public List<Donation> getDonationsByStatus(
            @PathVariable String status) {

        return donationRepository.findByStatus(status);
    }

    @GetMapping("/category/{category}")
    public List<Donation> getDonationsByCategory(
            @PathVariable String category) {

        return donationRepository.findByCategory(category);
    }

    @GetMapping("/donor/{donorId}")
    public List<Donation> getDonationsByDonor(
            @PathVariable Long donorId) {

        return donationRepository.findByDonorId(donorId);
    }

    @GetMapping("/food")
    public List<Donation> getFoodDonations() {

        return donationRepository.findByCategory("FOOD");
    }

    @GetMapping("/grocery")
public List<Donation> getGroceryDonations() {

    return donationRepository.findByCategory("GROCERY");
}

    @PreAuthorize("hasRole('DONOR')")
@PostMapping(consumes = "multipart/form-data")
public Donation createDonation(
        @RequestParam String title,
        @RequestParam String category,
        @RequestParam(required = false) String description,
        @RequestParam String quantity,
        @RequestParam(required = false) String location,
        @RequestParam(required = false) MultipartFile image)
        throws IOException {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    User donor = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Logged-in donor not found"));

    if (!"DONOR".equalsIgnoreCase(donor.getRole())) {
        throw new RuntimeException("Only donors can create donations");
    }

    Donation donation = new Donation();

    donation.setTitle(title);
    donation.setCategory(category);
    donation.setDescription(description);
    donation.setQuantity(quantity);
    donation.setLocation(location);
    donation.setStatus("AVAILABLE");
    donation.setCreatedAt(java.time.LocalDateTime.now());
    donation.setDonor(donor);

    if (image != null && !image.isEmpty()) {

        String fileName =
                UUID.randomUUID() + "_" + image.getOriginalFilename();

        Path uploadPath = Paths.get("uploads");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);

        Files.copy(
                image.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        donation.setImageUrl(fileName);
    }

    return donationRepository.save(donation);
}

    @PreAuthorize("hasRole('DONOR')")
@PostMapping("/upload-image")
public String uploadImage(@RequestParam("image") MultipartFile image)
            throws IOException {

        if (image.isEmpty()) {
            throw new RuntimeException("Please select an image");
        }

        String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();

        Path uploadPath = Paths.get("uploads");

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(fileName);

        Files.copy(
                image.getInputStream(),
                filePath,
                StandardCopyOption.REPLACE_EXISTING
        );

        return "Image uploaded successfully: " + fileName;
    }

    @GetMapping("/search")
    public List<Donation> searchDonations(
            @RequestParam String keyword) {
        return donationRepository
                .findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrLocationContainingIgnoreCase(
                        keyword,
                        keyword,
                        keyword
                );
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'DONOR')")
@PutMapping("/{id}/status")
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
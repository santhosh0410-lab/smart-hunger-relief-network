package Smart.Hunger.Relief.Network.controller;

import Smart.Hunger.Relief.Network.model.Donation;
import Smart.Hunger.Relief.Network.model.DonationRequest;
import Smart.Hunger.Relief.Network.model.User;
import Smart.Hunger.Relief.Network.repository.DonationRepository;
import Smart.Hunger.Relief.Network.repository.DonationRequestRepository;
import Smart.Hunger.Relief.Network.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
public class DonationRequestController {

    private final DonationRequestRepository requestRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public DonationRequestController(
            DonationRequestRepository requestRepository,
            DonationRepository donationRepository,
            UserRepository userRepository) {

        this.requestRepository = requestRepository;
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
@PreAuthorize("hasRole('VOLUNTEER')")
public DonationRequest createRequest(
        @RequestParam Long donationId) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    User volunteer = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Logged-in volunteer not found"));

    if (!"VOLUNTEER".equalsIgnoreCase(volunteer.getRole())) {
        throw new RuntimeException(
                "Only volunteers can request donations");
    }

    Donation donation = donationRepository.findById(donationId)
            .orElseThrow(() ->
                    new RuntimeException("Donation not found"));

    if (!"AVAILABLE".equals(donation.getStatus())) {
        throw new RuntimeException(
                "This donation is not available");
    }

    DonationRequest request = new DonationRequest();

    request.setDonation(donation);
    request.setVolunteer(volunteer);
    request.setStatus("PENDING");
    request.setRequestedAt(LocalDateTime.now());

    donation.setStatus("REQUESTED");

    donationRepository.save(donation);

    return requestRepository.save(request);
}

    @GetMapping
    public List<DonationRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    @GetMapping("/volunteer/{volunteerId}")
    public List<DonationRequest> getVolunteerRequests(
            @PathVariable Long volunteerId) {

        return requestRepository.findByVolunteerId(volunteerId);
    }

    @GetMapping("/donation/{donationId}")
    public List<DonationRequest> getDonationRequests(
            @PathVariable Long donationId) {

        return requestRepository.findByDonationId(donationId);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'DONOR')")
    @PutMapping("/{requestId}/accept")
    public DonationRequest acceptRequest(
            @PathVariable Long requestId) {

        DonationRequest request = requestRepository.findById(requestId)
                .orElseThrow(() ->
                        new RuntimeException("Donation request not found"));

        request.setStatus("ACCEPTED");

        Donation donation = request.getDonation();
        donation.setStatus("ACCEPTED");

        donationRepository.save(donation);

        return requestRepository.save(request);
    }

    @PutMapping("/{requestId}/status")
@PreAuthorize("hasRole('VOLUNTEER')")
public DonationRequest updateRequestStatus(
        @PathVariable Long requestId,
        @RequestParam String status) {

    Authentication authentication =
            SecurityContextHolder.getContext().getAuthentication();

    String email = authentication.getName();

    User volunteer = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new RuntimeException("Logged-in volunteer not found"));

    DonationRequest request = requestRepository.findById(requestId)
            .orElseThrow(() ->
                    new RuntimeException("Donation request not found"));

    if (!request.getVolunteer().getId().equals(volunteer.getId())) {
        throw new RuntimeException(
                "You can update only your own donation request");
    }

    String normalizedStatus = status.toUpperCase();

    if (!normalizedStatus.equals("PICKED_UP")
            && !normalizedStatus.equals("DISTRIBUTED")
            && !normalizedStatus.equals("COMPLETED")) {

        throw new RuntimeException(
                "Invalid volunteer status");
    }

    request.setStatus(normalizedStatus);

    Donation donation = request.getDonation();
    donation.setStatus(normalizedStatus);

    donationRepository.save(donation);

    return requestRepository.save(request);
}

}
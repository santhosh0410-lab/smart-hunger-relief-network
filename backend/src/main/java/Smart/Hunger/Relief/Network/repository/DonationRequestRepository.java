package Smart.Hunger.Relief.Network.repository;

import Smart.Hunger.Relief.Network.model.DonationRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRequestRepository
        extends JpaRepository<DonationRequest, Long> {

    List<DonationRequest> findByVolunteerId(Long volunteerId);

    List<DonationRequest> findByDonationId(Long donationId);

    
}
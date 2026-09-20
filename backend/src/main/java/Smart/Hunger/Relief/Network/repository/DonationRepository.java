package Smart.Hunger.Relief.Network.repository;

import Smart.Hunger.Relief.Network.model.Donation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DonationRepository extends JpaRepository<Donation, Long> {

    List<Donation> findByStatus(String status);

    List<Donation> findByCategory(String category);

    List<Donation> findByDonorId(Long donorId);

    List<Donation> findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCaseOrLocationContainingIgnoreCase(
        String title,
        String description,
        String location
    );
    long countByStatus(String status);

    long countByCategory(String category);

    long countByCategoryAndStatus(String category, String status);

}
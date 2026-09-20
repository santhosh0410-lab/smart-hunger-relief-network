package Smart.Hunger.Relief.Network.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category;

    private String description;

    @Column(nullable = false)
    private String quantity;

    private String location;

    @Column(nullable = false)
    private String status;

    private String imageUrl;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private User donor;

    public Donation() {
    }

    public Donation(
            String title,
            String category,
            String description,
            String quantity,
            String location,
            String status,
            String imageUrl,
            LocalDateTime createdAt,
            User donor) {

        this.title = title;
        this.category = category;
        this.description = description;
        this.quantity = quantity;
        this.location = location;
        this.status = status;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.donor = donor;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public User getDonor() {
        return donor;
    }

    public void setDonor(User donor) {
        this.donor = donor;
    }
}
package com.finddr.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "doctors")
@Data
@ToString(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = true)
public class Doctor extends BaseEntity {

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "clinic_id")
    private Clinic clinic;

    @Min(0)
    @Column(name = "experience", nullable = false)
    private int experience = 0;

    @ManyToOne
    @JoinColumn(name = "speciality_id")
    private Speciality speciality;

    @Min(0)
    @Column(name = "consultation_fees", nullable = false)
    private int fees;

    @DecimalMin(value = "0.0", inclusive = true)
    @DecimalMax(value = "5.0", inclusive = true)
    @Column(name = "rating", nullable = false)
    private double rating = 0.0;

    @Column(name = "is_prime", nullable = false)
    private boolean isPrime = false;

    @Size(max = 500)
    @Column(name = "description", length = 500)
    private String description;

  @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, orphanRemoval = true)
  private Set<Review> reviews = new HashSet<>();

  public void addReview(Review review){
    this.reviews.add(review);
    review.setDoctor(this);
  }

}

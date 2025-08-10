package com.finddr.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Check;

@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = true)
@Entity
@Table(name = "reviews")
public class Review extends BaseEntity {

  @NotNull
  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "appointment_id", nullable = false, unique = true)
  private Appointment appointment;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "patient_id", nullable = false)
  private User patient;

  @NotNull
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "doctor_id", nullable = false)
  private Doctor doctor;

  @NotNull(message = "Rating is required")
  @Min(value = 1, message = "Rating must be at least 1")
  @Max(value = 5, message = "Rating must be at most 5")
  @Check(constraints = "rating >= 1 AND rating <= 5")
  private int rating;

  @Size(max = 300, message = "Comment cannot exceed 1000 characters")
  @Column(name = "comment", length = 300)
  private String comment;
}

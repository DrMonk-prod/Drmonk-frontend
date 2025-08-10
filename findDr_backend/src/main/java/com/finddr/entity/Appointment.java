package com.finddr.entity;

import com.finddr.entity.type.AppointmentStatus;
import com.finddr.entity.type.RoleType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "appointments")
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = true)
public class Appointment extends BaseEntity {

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "doctor_id", nullable = false)
  private Doctor doctor;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "patient_id", nullable = false)
  private User patient;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "clinic_id", nullable = false)
  private Clinic clinic;

  @NotNull(message = "Appointment time cannot be null")
  @Column(name = "appointment_time", nullable = false)
  private LocalDateTime appointmentTime;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private AppointmentStatus status = AppointmentStatus.SCHEDULED;

  @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
  @JoinColumn(name = "payment_id",nullable = false)
  private Payment payment;

  @OneToOne(mappedBy = "appointment",cascade = CascadeType.ALL)
  private Review review;

  @Size(max = 500, message = "Reason for visit should be at most 500 characters")
  @Column(name = "reason_for_visit", length = 500)
  private String reasonForVisit;

  @Enumerated(EnumType.STRING)
  @Column(name = "cancelled_by")
  private RoleType cancelledBy;

  @Size(max = 500, message = "Cancellation reason should be at most 500 characters")
  @Column(name = "cancellation_reason", length = 500)
  private String cancellationReason;


  public void cancel(RoleType roleType, String reason){
    this.status = AppointmentStatus.CANCELLED;
    this.cancelledBy = roleType;
    this.cancellationReason = reason;
  }

  public void initiatePayment(Payment payment) {
    this.payment = payment;
    payment.setAppointment(this);
  }
}

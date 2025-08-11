package com.finddr.service;

import com.finddr.entity.Appointment;
import com.finddr.entity.type.AppointmentStatus;
import com.finddr.entity.type.RoleType;
import com.finddr.repository.AppointmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AppointmentCleanupService {
  private final AppointmentRepository appointmentRepository;
  private final AppointmentService appointmentService;

  @Scheduled(cron = "0 */3 * * * *")
  public void cleanupStalePendingAppointments() {
    log.info("Running scheduled appointment cleanup task...");

    // Define a timeout period (e.g., 5 minutes)
    LocalDateTime timeoutTime = LocalDateTime.now().minusMinutes(3);

    // Find all appointments with PENDING status that were created before the timeout
    List<Appointment> staleAppointments = appointmentRepository.findByStatusAndCreatedAtBefore(AppointmentStatus.PENDING, timeoutTime);

    if (staleAppointments.isEmpty()) {
      log.info("No stale pending appointments found for cleanup.");
      return;
    }

    for (Appointment appointment : staleAppointments) {
      log.info("Cancelling stale pending appointment with id: {}", appointment.getId());
      // Calling the overloaded cancelAppointment method for automated cleanup
      appointmentService.cancelAppointment(appointment.getId(), RoleType.PATIENT, "Stale appointment");
    }
  }
}

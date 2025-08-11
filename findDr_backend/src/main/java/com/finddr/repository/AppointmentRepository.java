package com.finddr.repository;

import com.finddr.entity.Appointment;
import com.finddr.entity.Doctor;
import com.finddr.entity.type.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

  boolean existsByDoctorAndAppointmentTime(Doctor doctor, LocalDateTime appointmentTime);

  List<Appointment> findByStatusAndCreatedAtBefore(AppointmentStatus status, LocalDateTime cutoffTime);

  List<Appointment> findByPatientId(Long patientId);

  boolean existsByDoctorAndAppointmentTimeAndStatusNot(Doctor doctor, LocalDateTime appointmentTime, AppointmentStatus status);

  @Query("SELECT a.appointmentTime FROM Appointment a " +
          "WHERE a.doctor.id = :doctorId " +
          "AND a.appointmentTime >= :startOfDay " +
          "AND a.appointmentTime < :startOfNextDay " +
          "AND a.status IN ('PENDING','SCHEDULED')")
  Set<LocalDateTime> findBookedTimeSlotByDoctorAndDateRange(
          Long doctorId,
          LocalDateTime startOfDay,
          LocalDateTime startOfNextDay
  );

}

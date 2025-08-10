package com.finddr.dto.appointment;

import com.finddr.entity.type.AppointmentStatus;
import com.finddr.entity.type.RoleType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentInfo {
  private LocalDateTime appointmentTime;
  private AppointmentStatus status;
  private String reasonForVisit;
  private RoleType cancelledBy;
  private String cancellationReason;
}

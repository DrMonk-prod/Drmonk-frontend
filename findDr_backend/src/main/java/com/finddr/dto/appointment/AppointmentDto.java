package com.finddr.dto.appointment;

import com.finddr.dto.BaseDto;
import com.finddr.dto.clinic.ClinicInfo;
import com.finddr.dto.doctor.DoctorInfo;
import com.finddr.dto.review.ReviewInfo;
import com.finddr.entity.type.AppointmentStatus;
import com.finddr.entity.type.RoleType;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true,callSuper = true)
public class AppointmentDto extends BaseDto {

  private LocalDateTime appointmentTime;
  private AppointmentStatus status;
  private String reasonForVisit;
  private RoleType cancelledBy;
  private String cancellationReason;

  private DoctorInfo doctor;
  private ClinicInfo clinic;
  private ReviewInfo review;
}



package com.finddr.dto.review;

import com.finddr.dto.appointment.AppointmentInfo;
import com.finddr.dto.clinic.ClinicInfo;
import com.finddr.dto.doctor.DoctorInfo;
import lombok.Data;

@Data
public class ReviewResponseDto {
  private AppointmentInfo appointment;
  private DoctorInfo doctor;
  private ClinicInfo clinic;
}

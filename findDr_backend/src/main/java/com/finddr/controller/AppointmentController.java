package com.finddr.controller;

import com.finddr.dto.ApiResponse;
import com.finddr.dto.appointment.AppointmentCancellationDto;
import com.finddr.dto.appointment.AppointmentDto;
import com.finddr.dto.appointment.BookAppointmentDto;
import com.finddr.dto.appointment.PaymentConfirmationDto;
import com.finddr.security.CustomUserDetails;
import com.finddr.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

  private final AppointmentService appointmentService;

  @PostMapping("/book")
  //  @PreAuthorize("hasRole('PATIENT')")
  public ResponseEntity<ApiResponse<AppointmentDto>> initiateAppointment(@AuthenticationPrincipal CustomUserDetails userDetails, @Valid @RequestBody BookAppointmentDto bookAppointmentDto) {
    return ResponseEntity.ok(appointmentService.initiateAppointment(userDetails, bookAppointmentDto));
  }

  @PutMapping("/{id}/confirm-payment")
  public ResponseEntity<ApiResponse<AppointmentDto>> confirmAppointmentPayment(@PathVariable Long id, @RequestBody PaymentConfirmationDto paymentConfirmationDto) {
    return ResponseEntity.ok(appointmentService.confirmAppointmentPayment(id,paymentConfirmationDto));
  }



  @PutMapping("/cancel/{id}")
  @PreAuthorize("hasAnyRole('PATIENT','DOCTOR')")
  public ResponseEntity<ApiResponse<String>> cancelAppointment(@AuthenticationPrincipal CustomUserDetails userDetails, @PathVariable Long id,@Valid @RequestBody AppointmentCancellationDto appointmentCancellationDto) {
    appointmentService.cancelAppointment(id,userDetails.getUser().getRole(),appointmentCancellationDto);
    return ResponseEntity.ok(ApiResponse.send("Appointment cancelled successfully with id: " + id));
  }
}

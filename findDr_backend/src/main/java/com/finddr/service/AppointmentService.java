package com.finddr.service;

import com.finddr.dto.ApiResponse;
import com.finddr.dto.appointment.AppointmentCancellationDto;
import com.finddr.dto.appointment.AppointmentDto;
import com.finddr.dto.appointment.BookAppointmentDto;
import com.finddr.dto.appointment.PaymentConfirmationDto;
import com.finddr.entity.*;
import com.finddr.entity.type.AppointmentStatus;
import com.finddr.entity.type.PaymentStatus;
import com.finddr.entity.type.RoleType;
import com.finddr.exception.ApiException;
import com.finddr.exception.ErrorCode;
import com.finddr.repository.AppointmentRepository;
import com.finddr.repository.DoctorLeaveRepository;
import com.finddr.repository.DoctorRepository;
import com.finddr.repository.DoctorScheduleRepository;
import com.finddr.security.CustomUserDetails;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Service
@Transactional
@RequiredArgsConstructor
public class AppointmentService {
  private final AppointmentRepository appointmentRepository;
  private final DoctorRepository doctorRepository;
  private final DoctorScheduleRepository doctorScheduleRepository;
  private final DoctorLeaveRepository doctorLeaveRepository;
  private final ModelMapper mapper;

  public ApiResponse<AppointmentDto> initiateAppointment(CustomUserDetails userDetails, BookAppointmentDto bookAppointmentDto) {
    if(userDetails == null)
      throw new ApiException(ErrorCode.USER_NOT_FOUND, "User not found", HttpStatus.UNAUTHORIZED);

    Doctor doctor = doctorRepository.findById(bookAppointmentDto.getDoctorId())
            .orElseThrow(() -> new ApiException(
                    ErrorCode.DOCTOR_NOT_FOUND,
                    "Doctor not found with id: " + bookAppointmentDto.getDoctorId(),
                    HttpStatus.NOT_FOUND
            ));

    Clinic clinic=doctor.getClinic();
    if(clinic==null)
      throw new ApiException(ErrorCode.DOCTOR_HAS_NO_CLINIC,"Doctor is not assigned to any clinic",HttpStatus.NOT_FOUND);

    User user=userDetails.getUser();
    if(user==null)
      throw new ApiException(ErrorCode.USER_NOT_FOUND, "User not found", HttpStatus.UNAUTHORIZED);

    LocalDateTime combinedDateTime=LocalDateTime.of(bookAppointmentDto.getDate(), bookAppointmentDto.getTime());
    validateTimeSlot(doctor,combinedDateTime);

    // Step 1: Create and populate the payment entity first
    Payment payment = new Payment();
    payment.setPaymentStatus(PaymentStatus.PENDING);
    payment.setAmount(doctor.getFees());

    // Step 2: Create the appointment entity and set its other details
    Appointment appointment=new Appointment();
    appointment.setPatient(user);
    appointment.setDoctor(doctor);
    appointment.setClinic(clinic);
    appointment.setStatus(AppointmentStatus.PENDING);
    appointment.setAppointmentTime(combinedDateTime);
    appointment.setReasonForVisit(bookAppointmentDto.getReason());

    // Step 3: Use the single method to set up the bidirectional relationship
    appointment.initiatePayment(payment);

    appointmentRepository.save(appointment);
    return ApiResponse.of("Appointment booked successfully!",mapper.map(appointment, AppointmentDto.class));
  }

  public ApiResponse<AppointmentDto> confirmAppointmentPayment(Long appointmentId, PaymentConfirmationDto paymentConfirmationDto) {
    Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new ApiException(
                    ErrorCode.APPOINTMENT_NOT_FOUND,
                    "Appointment not found with id: " + appointmentId,
                    HttpStatus.NOT_FOUND
            ));

    if (appointment.getStatus() == AppointmentStatus.PENDING) {
      if(paymentConfirmationDto.getPaymentId()==null){
        appointment.getPayment().setPaymentStatus(PaymentStatus.FAILED);
        throw new ApiException(ErrorCode.INVALID_INPUT,"Payment id is required",HttpStatus.BAD_REQUEST);
      }
      appointment.setStatus(AppointmentStatus.SCHEDULED);
      appointment.getPayment().setPaymentStatus(PaymentStatus.COMPLETED);
      appointmentRepository.save(appointment);
    }

    return ApiResponse.of("Appointment confirmed successfully!",mapper.map(appointment, AppointmentDto.class));
  }

  public void cancelAppointment(Long appointmentId, RoleType role, AppointmentCancellationDto appointmentCancellationDto) {

    Appointment appointment=appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new ApiException(
                    ErrorCode.APPOINTMENT_NOT_FOUND,
                    "Appointment not found with id: " + appointmentId,
                    HttpStatus.NOT_FOUND
            ));
    appointment.cancel(role,appointmentCancellationDto.getReason());
    appointmentRepository.save(appointment);
  }

  public void cancelAppointment(Long appointmentId, RoleType role,String reason) {

    Appointment appointment=appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new ApiException(
                    ErrorCode.APPOINTMENT_NOT_FOUND,
                    "Appointment not found with id: " + appointmentId,
                    HttpStatus.NOT_FOUND
            ));
    appointment.cancel(role,reason);
    appointmentRepository.save(appointment);
  }

  // validates time slot
  public void validateTimeSlot(Doctor doctor,LocalDateTime appointmentTime){
    // a. Check against the doctor's weekly schedule
    DayOfWeek dayOfWeek=appointmentTime.getDayOfWeek();
    LocalTime time=appointmentTime.toLocalTime();

    DoctorSchedule schedule=doctorScheduleRepository.findByDoctorIdAndDayOfWeek(doctor.getId(),dayOfWeek)
            .orElseThrow(()->new ApiException(ErrorCode.INVALID_APPOINTMENT_SLOT,"Doctor has no schedule for this day",HttpStatus.BAD_REQUEST));

    if(time.isBefore(schedule.getStartTime()) || time.isAfter(schedule.getEndTime()))
      throw new ApiException(ErrorCode.INVALID_APPOINTMENT_SLOT,"Doctor has no schedule for this time",HttpStatus.BAD_REQUEST);

    //b. check against the doctor's leaves
    boolean onLeave=doctorLeaveRepository.isDoctorOnLeave(doctor.getId(),appointmentTime);
    if(onLeave)
      throw new ApiException(ErrorCode.INVALID_APPOINTMENT_SLOT,"Doctor is on leave",HttpStatus.BAD_REQUEST);

    //c. Check if slot is booked already
    boolean alreadyBooked=appointmentRepository.existsByDoctorAndAppointmentTimeAndStatusNot(doctor,appointmentTime,AppointmentStatus.CANCELLED);
    if(alreadyBooked)
      throw new ApiException(ErrorCode.INVALID_APPOINTMENT_SLOT,"Slot is already booked",HttpStatus.BAD_REQUEST);
  }
}





//@PutMapping("/me/appointments/{appointmentId}/cancel")
//public ResponseEntity<Void> cancelMyAppointment(@AuthenticationPrincipal UserPrincipal userPrincipal, @PathVariable Long appointmentId) {
//  // patientService.cancelAppointment(userPrincipal.getId(), appointmentId);
//  return ResponseEntity.noContent().build();
//}
//
//@GetMapping("/me/reviews")
//public ResponseEntity<List<ReviewDto>> getMyReviews(@AuthenticationPrincipal UserPrincipal userPrincipal) {
//  // return ResponseEntity.ok(patientService.getPatientReviews(userPrincipal.getId()));
//  return ResponseEntity.ok().build();
//}

//Booking an Appointment (AppointmentController)
//
//POST /api/v1/appointments
//
//Description: Creates a new appointment. The patient's ID is taken from the security token.
//
//Request Body: BookAppointmentRequestDto containing doctorId, clinicId, appointmentTime, reasonForVisit, etc.
//
//Submitting a Review (ReviewController)
//
//POST /api/v1/reviews
//
//Description: Creates a new review for a completed appointment.
//
//Request Body: SubmitReviewRequestDto containing appointmentId, rating, comment.
//
//        Finding Doctors (DoctorController)
//
//GET /api/v1/doctors
//
//Description: Searches for doctors based on criteria.
//
//Query Parameters: ?city=Pune, ?speciality=Cardiology.
//
//        GET /api/v1/doctors/{doctorId}/availability
//
//Description: Fetches the available time slots for a specific doctor on a given date.
//
//Query Parameter: ?date=2025-08-10.
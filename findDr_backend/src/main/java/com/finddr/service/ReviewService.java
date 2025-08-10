package com.finddr.service;

import com.finddr.dto.ApiResponse;
import com.finddr.dto.review.ReviewRequestDto;
import com.finddr.entity.Appointment;
import com.finddr.entity.Doctor;
import com.finddr.entity.Review;
import com.finddr.entity.User;
import com.finddr.entity.type.AppointmentStatus;
import com.finddr.exception.ApiException;
import com.finddr.exception.ErrorCode;
import com.finddr.repository.AppointmentRepository;
import com.finddr.repository.DoctorRepository;
import com.finddr.repository.ReviewRepository;
import com.finddr.repository.UserRepository;
import com.finddr.security.CustomUserDetails;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewService {
  private final UserRepository userRepository;
  private final AppointmentRepository appointmentRepository;
  private final ReviewRepository reviewRepository;
  private final ModelMapper mapper;
  private final DoctorRepository doctorRepository;

  public ApiResponse<String> createReview(CustomUserDetails userDetails, ReviewRequestDto reviewRequestDto) {
    User user=userRepository.findById(userDetails.getUser().getId()).orElseThrow(()-> new ApiException(
            ErrorCode.USER_NOT_FOUND,
            "user not found",
            HttpStatus.NOT_FOUND
    ));

    Appointment appointment=appointmentRepository.findById(reviewRequestDto.getAppointmentId()).orElse(null);
    if(appointment==null)
      throw new ApiException(ErrorCode.APPOINTMENT_NOT_FOUND,"Appointment not found",HttpStatus.NOT_FOUND);

    if(appointment.getStatus()!= AppointmentStatus.COMPLETED){
      throw new ApiException(ErrorCode.INVALID_INPUT,"Appointment is not completed",HttpStatus.BAD_REQUEST);
    }

    Doctor doctor=doctorRepository.findById(appointment.getDoctor().getId()).orElse(null);
    if(doctor==null)
      throw new ApiException(ErrorCode.DOCTOR_NOT_FOUND,"Doctor not found",HttpStatus.NOT_FOUND);

    Review review=new Review();
    review.setAppointment(appointment);
    review.setPatient(user);
    review.setRating(reviewRequestDto.getRating());
    review.setComment(reviewRequestDto.getComment());
    doctor.addReview(review);

    double rating=reviewRequestDto.getRating();
    double prevAvgRating=doctor.getRating();
    int reviewCount=reviewRepository.countByDoctorId(doctor.getId());

    double updatedAvg=(prevAvgRating * reviewCount + rating) / (reviewCount + 1);
    doctor.setRating(updatedAvg);

    doctorRepository.save(doctor);
    return  ApiResponse.send("Review created successfully");
  }
}

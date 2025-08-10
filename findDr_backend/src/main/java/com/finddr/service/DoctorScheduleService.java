package com.finddr.service;

import com.finddr.dto.appointment.SimpleSlotDto;
import com.finddr.dto.doctor.DoctorScheduleDto;
import com.finddr.entity.DoctorLeave;
import com.finddr.entity.DoctorSchedule;
import com.finddr.exception.ApiException;
import com.finddr.exception.ErrorCode;
import com.finddr.repository.AppointmentRepository;
import com.finddr.repository.DoctorLeaveRepository;
import com.finddr.repository.DoctorScheduleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class DoctorScheduleService {
    private final DoctorLeaveRepository doctorLeaveRepository;
    private final DoctorScheduleRepository scheduleRepository;
    private final AppointmentRepository appointmentRepository;
    private final ModelMapper mapper;

  public DoctorScheduleDto getScheduleByDoctorandDay(Long id, String day) {

      DayOfWeek dayOfWeek;
      try {
        dayOfWeek = DayOfWeek.valueOf(day.toUpperCase());
      } catch (IllegalArgumentException e) {
        throw new ApiException(
                ErrorCode.INVALID_INPUT,
                "Invalid day of week: " + day + ". Please use a valid day (e.g., 'MONDAY').",
                HttpStatus.BAD_REQUEST
        );
      }

        DoctorSchedule schedule = scheduleRepository.findByDoctorIdAndDayOfWeek(id, dayOfWeek)
                .orElseThrow(() -> new ApiException(
                        ErrorCode.SCHEDULE_NOT_FOUND,
                        "Doctor schedule not found with id: " + id,
                        HttpStatus.NOT_FOUND
                ));

        return mapToDto(schedule);
    }


    private DoctorScheduleDto mapToDto(DoctorSchedule schedule) {
        DoctorScheduleDto dto = new DoctorScheduleDto();
        dto.setId(schedule.getId());
        dto.setDoctorId(schedule.getDoctor().getId());
        dto.setDayOfWeek(schedule.getDayOfWeek());
        dto.setStartTime(schedule.getStartTime());
        dto.setEndTime(schedule.getEndTime());
        dto.setSlotDurationMinutes(schedule.getSlotDurationMinutes());
        return dto;
    }

//  public List<SimpleSlotDto> getDoctorSlotsForDate(Long doctorId, LocalDate forDate) {
//      DayOfWeek dayOfWeek = forDate.getDayOfWeek();
//      DoctorSchedule schedule = scheduleRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek)
//              .orElseThrow(() -> new ApiException(
//                      ErrorCode.SCHEDULE_NOT_FOUND,
//                      "Doctor schedule not found with id: " + doctorId,
//                      HttpStatus.NOT_FOUND
//              ));
//
//    //If doctor has no schedule for this day, or is on leave, return an empty list.
//    if (schedule == null) {
//      return Collections.emptyList();
//    }
//
//    LocalDateTime startOfDay = forDate.atStartOfDay();
//    LocalDateTime startOfNextDay = startOfDay.plusDays(1);
//
//
//    List<DoctorLeave> leaves = doctorLeaveRepository.findLeavesByDoctorAndDateRange(doctorId,startOfDay,startOfNextDay);
//
////    if(doctorLeaveRepository.findLeavesByDoctorAndDateRange(doctorId,startOfDay,endOfDay))
////      return Collections.emptyList();
//
//
//    Set<LocalTime> bookedSlots = appointmentRepository
//            .findBookedTimeSlotByDoctorAndDateRange(doctorId, startOfDay,startOfNextDay).stream()
//            .map(LocalDateTime::toLocalTime)
//            .collect(Collectors.toSet());
//
////    bookedSlots.forEach(System.out::println);
//
//    List<SimpleSlotDto> allSlots = new ArrayList<>();
//    LocalTime currentTime = schedule.getStartTime();
//    int slotDurationMinutes = schedule.getSlotDurationMinutes();
//
//    while(currentTime.isBefore(schedule.getEndTime())){
//      LocalDateTime slotStartDateTime = LocalDateTime.of(forDate, currentTime);
//      LocalDateTime slotEndDateTime = slotStartDateTime.plusMinutes(slotDurationMinutes);
//
//      boolean isBooked = bookedSlots.contains(currentTime);
//
//      boolean isInLeave = leaves.stream().anyMatch(leave ->
//              !slotEndDateTime.isBefore(leave.getStartDate()) && !slotStartDateTime.isAfter(leave.getEndDate())
//      );
//
//      boolean isAvailable=!isBooked && !isInLeave;
//      allSlots.add(new SimpleSlotDto(currentTime,isAvailable));
//      currentTime=currentTime.plusMinutes(slotDurationMinutes);
//      System.out.println(currentTime);
//    }
//
//    return allSlots;
//  }

public List<SimpleSlotDto> getDoctorSlotsForDate(Long doctorId, LocalDate forDate) {
  DayOfWeek dayOfWeek = forDate.getDayOfWeek();

  // Fetch doctor's schedule for the day or throw if not found
  DoctorSchedule schedule = scheduleRepository.findByDoctorIdAndDayOfWeek(doctorId, dayOfWeek).orElse(null);

  if (schedule == null) {
    return Collections.emptyList();
  }

  LocalDateTime startOfDay = forDate.atStartOfDay();
  LocalDateTime startOfNextDay = startOfDay.plusDays(1);

  // Fetch leaves overlapping with the day
  List<DoctorLeave> leaves = doctorLeaveRepository.findLeavesByDoctorAndDateRange(doctorId, startOfDay, startOfNextDay);

  if (leaves.size() > 0) {
    System.out.println("Leaves emptyy");
  }
  leaves.forEach(leave -> System.out.println(leave.getStartDate() + " " + leave.getEndDate()));

  // Fetch already booked appointment slots for the day (pending or scheduled)
  Set<LocalTime> bookedSlots = appointmentRepository
          .findBookedTimeSlotByDoctorAndDateRange(doctorId, startOfDay, startOfNextDay)
          .stream()
          .map(LocalDateTime::toLocalTime)
          .collect(Collectors.toSet());

  List<SimpleSlotDto> allSlots = new ArrayList<>();
  LocalTime currentTime = schedule.getStartTime();
  int slotDurationMinutes = schedule.getSlotDurationMinutes();

  while (currentTime.isBefore(schedule.getEndTime())) {
    LocalDateTime slotStartDateTime = LocalDateTime.of(forDate, currentTime);
    LocalDateTime slotEndDateTime = slotStartDateTime.plusMinutes(slotDurationMinutes);

    boolean isBooked = bookedSlots.contains(currentTime);

    // Check if slot overlaps any leave period
    boolean isInLeave = leaves.stream().anyMatch(leave ->
            !slotEndDateTime.isBefore(leave.getStartDate()) && !slotStartDateTime.isAfter(leave.getEndDate())
    );

    boolean isAvailable = !isBooked && !isInLeave;

    allSlots.add(new SimpleSlotDto(currentTime, isAvailable));

    currentTime = currentTime.plusMinutes(slotDurationMinutes);
  }

  return allSlots;
}



}

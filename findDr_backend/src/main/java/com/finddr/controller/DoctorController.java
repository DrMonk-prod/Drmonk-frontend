package com.finddr.controller;

import com.finddr.dto.appointment.SimpleSlotDto;
import com.finddr.dto.doctor.DoctorDistanceDto;
import com.finddr.dto.doctor.DoctorRequestDto;
import com.finddr.dto.doctor.DoctorResponseDto;
import com.finddr.dto.doctor.DoctorScheduleDto;
import com.finddr.service.DoctorScheduleService;
import com.finddr.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {
    private final DoctorService doctorService;
    private final DoctorScheduleService scheduleService;

    @GetMapping("/")
    public ResponseEntity<List<DoctorResponseDto>> getAllDoctor() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/speciality")
    public ResponseEntity<List<DoctorDistanceDto>> getDoctorsBySpecialityAndCity(
            @RequestParam String speciality,
            @RequestParam String city,
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "20") double maxDistance
    ){
      List<DoctorDistanceDto> doctors=doctorService.getDoctorsBySpecialityAndCity(
              speciality, city, latitude, longitude, maxDistance
      );
      return ResponseEntity.ok(doctors);
    }

    @PostMapping
    public ResponseEntity<DoctorResponseDto> createDoctor(@RequestBody @Valid DoctorRequestDto dto) {

        return ResponseEntity.ok(doctorService.createDoctor(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DoctorResponseDto> getDoctorById(@PathVariable Long id) {
        DoctorResponseDto doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/{doctorId}/day/{day}")
    public ResponseEntity<DoctorScheduleDto> getSchedulesByDoctorAndDay(@PathVariable Long doctorId, @PathVariable String day) {
      return ResponseEntity.ok(scheduleService.getScheduleByDoctorandDay(doctorId, day));
    }

    @GetMapping("/{doctorId}/slots")
    public ResponseEntity<List<SimpleSlotDto>> getDoctorSlotsForDate(
            @PathVariable Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

      return ResponseEntity.ok(scheduleService.getDoctorSlotsForDate(doctorId, date));
    }
}

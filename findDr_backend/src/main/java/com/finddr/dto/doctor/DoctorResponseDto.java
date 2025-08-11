package com.finddr.dto.doctor;


import com.finddr.dto.SpecialityDto;
import com.finddr.dto.clinic.ClinicInfo;
import com.finddr.dto.user.UserDto;
import lombok.Data;

@Data
public class DoctorResponseDto {
    private Long id;
    private int experience;
    private int fees;
    private double rating;
    private boolean isPrime;
    private String description;
    private UserDto user;
    private SpecialityDto speciality;
    private ClinicInfo clinic;
}



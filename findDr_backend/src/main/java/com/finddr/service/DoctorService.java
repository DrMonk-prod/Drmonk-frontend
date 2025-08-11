package com.finddr.service;

import com.finddr.dto.doctor.DoctorDistanceDto;
import com.finddr.dto.doctor.DoctorRequestDto;
import com.finddr.dto.doctor.DoctorResponseDto;
import com.finddr.entity.Clinic;
import com.finddr.entity.Doctor;
import com.finddr.entity.Speciality;
import com.finddr.entity.User;
import com.finddr.exception.ApiException;
import com.finddr.exception.ErrorCode;
import com.finddr.repository.ClinicRepository;
import com.finddr.repository.DoctorRepository;
import com.finddr.repository.SpecialityRepository;
import com.finddr.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class DoctorService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final SpecialityRepository specialityRepository;
    private final ClinicRepository clinicRepository;
    private final ModelMapper mapper;

    public DoctorResponseDto createDoctor(DoctorRequestDto doctorDto) {
        Doctor doctor = mapper.map(doctorDto, Doctor.class);

        User user = userRepository.findById(doctorDto.getUserId()).orElse(null);
        Clinic clinic = clinicRepository.findById(doctorDto.getClinicId()).orElse(null);
        Speciality speciality = specialityRepository.findById(doctorDto.getSpecialtyId()).orElse(null);

        if (user == null || clinic == null || speciality == null) {
            throw new ApiException(ErrorCode.INADEQUATE_DOCTOR_DATA, "Inadequate data", HttpStatus.NOT_FOUND);
        }

        doctor.setUser(user);
        doctor.setClinic(clinic);
        doctor.setSpeciality(speciality);

        Doctor savedDoctor = doctorRepository.save(doctor);
        return mapper.map(savedDoctor, DoctorResponseDto.class);
    }

    public List<DoctorResponseDto> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return doctors.stream()
                .map(doctor->mapper.map(doctor,DoctorResponseDto.class))
                .toList();
    }

    public DoctorResponseDto getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ApiException(
                        ErrorCode.DOCTOR_NOT_FOUND,
                        "Doctor not found with id: " + id,
                        HttpStatus.NOT_FOUND
                ));

        return mapper.map(doctor, DoctorResponseDto.class);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }


  public List<DoctorDistanceDto> getDoctorsBySpecialityAndCity(String speciality, String city, double lat, double lng, double maxDistance) {
    List<DoctorDistanceDto> results = doctorRepository.findDoctorsBySpecialityCityDistance(speciality, city, lat, lng, maxDistance);

    return results;
  }

}

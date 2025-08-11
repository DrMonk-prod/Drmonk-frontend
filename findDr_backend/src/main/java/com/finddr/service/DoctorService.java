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
//      mapToDoctorResponseDto(savedDoctor)
        return mapper.map(savedDoctor, DoctorResponseDto.class);
    }

    public List<DoctorResponseDto> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
//      this::mapToDoctorResponseDto
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

//      mapToDoctorResponseDto(doctor)
        return mapper.map(doctor, DoctorResponseDto.class);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }


  public List<DoctorDistanceDto> getDoctorsBySpecialityAndCity(Long specialityId, String city, double lat, double lng, double maxDistance) {
    List<Object[]> results = doctorRepository.findDoctorsBySpecialityCityDistance(specialityId, city, lat, lng, maxDistance);

    return results.stream().map(row -> new DoctorDistanceDto(
            ((Number) row[0]).longValue(),          // doctorId
            ((Number) row[1]).intValue(),           // experience
            ((Number) row[2]).intValue(),           // fees
            ((Number) row[3]).doubleValue(),        // rating
            (String) row[4],                        // description
            ((Number) row[5]).intValue() == 1,      // prime (bit -> boolean)
            ((Number) row[6]).longValue(),          // specialityId
            (String) row[7],                        // specialityName
            (String) row[8],                        // specialityDesc
            ((Number) row[9]).longValue(),          // clinicId
            (String) row[10],                       // clinicName
            (String) row[11],                       // address
            ((Number) row[12]).doubleValue(),       // latitude
            ((Number) row[13]).doubleValue(),       // longitude
            (String) row[14],                       // pincode
            (String) row[15],                       // cityName
            ((Number) row[16]).doubleValue()        // distanceKm
    )).toList();
  }

//    private DoctorResponseDto mapToDoctorResponseDto(Doctor doctor) {
//        DoctorResponseDto dto = new DoctorResponseDto();
//
//        dto.setId(doctor.getId());
//        dto.setFullName(doctor.getUser().getFullName());
//        dto.setEmail(doctor.getUser().getEmail());
//        dto.setPhoneNumber(doctor.getUser().getPhoneNumber());
//        dto.setExperience(doctor.getExperience());
//        dto.setFees(doctor.getFees());
//        dto.setRating(doctor.getRating());
//        dto.setPrime(doctor.isPrime());
//        dto.setDescription(doctor.getDescription());
//        // Speciality
//        Speciality speciality = doctor.getSpeciality();
//        if (speciality != null) {
//            SpecialityDto specialityDto = new SpecialityDto();
//            specialityDto.setId(speciality.getId());
//            specialityDto.setName(speciality.getName());
//            dto.setSpeciality(specialityDto);
//        }
//
//        // Clinic
//        Clinic clinic = doctor.getClinic();
//        if (clinic != null) {
//            ClinicInfo clinicDto = new ClinicInfo();
//            clinicDto.setId(clinic.getId());
//            clinicDto.setName(clinic.getName());
//            clinicDto.setAddress(clinic.getAddress());
//            clinicDto.setPincode(clinic.getPincode());
//            clinicDto.setCityName(clinic.getCity().getName());
//            dto.setClinic(clinicDto);
//        }
//        return dto;
//    }


}

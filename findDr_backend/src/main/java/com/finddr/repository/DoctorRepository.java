package com.finddr.repository;

import com.finddr.dto.doctor.DoctorDistanceDto;
import com.finddr.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {

  @Query("SELECT d FROM Doctor d WHERE d.clinic.city.name = :city AND LOWER(d.user.fullName) LIKE LOWER(CONCAT('%', :query, '%'))")
  List<Doctor> searchByCityAndName(@Param("city") String city, @Param("query") String query);



  @Query(
          value = "CALL GetDoctorsBySpecialityCityDistance(:speciality, :city, :lat, :lng, :maxDistance)",
          nativeQuery = true
  )
  List<DoctorDistanceDto> findDoctorsBySpecialityCityDistance(String speciality, String city, double lat, double lng, double maxDistance);
}

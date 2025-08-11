package com.finddr.dto.doctor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDistanceDto {
  private Long doctorId;
  private String doctorName;
  private String doctorProfileImg;
  private Integer experience;
  private Integer fees;
  private Double rating;
  private String description;
  private Boolean prime;

  private Long specialityId;
  private String specialityName;
  private String specialityDesc;

  private Long clinicId;
  private String clinicName;
  private String address;
  private Double latitude;
  private Double longitude;
  private String pincode;
  private String cityName;

  private Double distanceKm;
}


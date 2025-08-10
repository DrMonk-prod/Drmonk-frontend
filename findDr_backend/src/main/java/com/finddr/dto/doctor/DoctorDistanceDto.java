package com.finddr.dto.doctor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DoctorDistanceDto {
  private Long doctorId;
  private int experience;
  private int fees;
  private double rating;
  private String description;
  private boolean prime;
  private Long specialityId;
  private String specialityName;
  private String specialityDesc;
  private Long clinicId;
  private String clinicName;
  private String address;
  private double latitude;
  private double longitude;
  private String pincode;
  private String cityName;
  private double distanceKm;
}


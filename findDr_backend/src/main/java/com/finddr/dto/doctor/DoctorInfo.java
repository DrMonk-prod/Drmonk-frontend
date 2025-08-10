package com.finddr.dto.doctor;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class DoctorInfo {
  private Long id;
  @JsonProperty("name")
  private String userFullName;
  private int fees;
  private double rating;
  @JsonProperty("profileImage")
  private String userProfileImg;
  @JsonProperty("email")
  private String userEmail;
  @JsonProperty("speciality")
  private String specialityName;
}

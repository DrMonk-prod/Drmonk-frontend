package com.finddr.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ReviewRequestDto {
  @NotNull
  private Long appointmentId;

  @NotNull
  private Long patientId;

  @NotNull
  private Long doctorId;

  @NotNull(message = "Rating is required")
  @Min(value = 1, message = "Rating must be at least 1")
  @Max(value = 5, message = "Rating must be at most 5")
  private int rating;

  @Size(max = 200, message = "Comment cannot exceed 200 characters")
  private String comment;
}

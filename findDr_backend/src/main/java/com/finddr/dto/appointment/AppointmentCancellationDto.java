package com.finddr.dto.appointment;

import com.finddr.entity.type.RoleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class AppointmentCancellationDto {

  private RoleType cancelledBy;

  @NotBlank(message = "Cancellation reason is required.")
  @Size(max = 200, message = "Cancellation reason should be at most 500 characters.")
  private String reason;
}

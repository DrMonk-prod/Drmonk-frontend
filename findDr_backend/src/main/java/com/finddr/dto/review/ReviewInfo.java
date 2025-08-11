package com.finddr.dto.review;

import com.finddr.dto.BaseDto;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = true)
public class ReviewInfo extends BaseDto {
  private int rating;
  private String comment;
}

package com.finddr.controller;

import com.finddr.dto.ApiResponse;
import com.finddr.dto.review.ReviewRequestDto;
import com.finddr.security.CustomUserDetails;
import com.finddr.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

  private final ReviewService reviewService;

  @PostMapping
  public ResponseEntity<ApiResponse<String>> createReview(@AuthenticationPrincipal CustomUserDetails userDetails, @RequestBody ReviewRequestDto reviewRequestDto) {
    return ResponseEntity.ok(reviewService.createReview(userDetails,reviewRequestDto));
  }

}

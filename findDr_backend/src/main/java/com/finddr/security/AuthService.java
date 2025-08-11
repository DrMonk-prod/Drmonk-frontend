package com.finddr.security;

import com.finddr.dto.AuthResponseDto;
import com.finddr.dto.user.LoginRequestDto;
import com.finddr.dto.user.RegisterRequestDto;
import com.finddr.dto.user.RegisterResponseDto;
import com.finddr.entity.User;
import com.finddr.exception.ApiException;
import com.finddr.exception.ErrorCode;
import com.finddr.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
  private final AuthenticationManager authenticationManager;
  private final AuthUtil authUtil;
  private final UserRepository userDao;
  private final ModelMapper mapper;
  private final PasswordEncoder passwordEncoder;

  public AuthResponseDto login(LoginRequestDto loginRequestDto) {
    Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(), loginRequestDto.getPassword())
    );

    User user = ((CustomUserDetails) authentication.getPrincipal()).getUser();

    String token = authUtil.generateToken(user);
    return new AuthResponseDto(token, user.getId(), user.getRole().name(), "Login successful");
  }

  public RegisterResponseDto signup(RegisterRequestDto registerRequestDto) {
    String email = registerRequestDto.getEmail().trim().toLowerCase();

    if (userDao.findByEmail(email).isPresent()) {
      throw new ApiException(
              ErrorCode.USER_ALREADY_EXIST,
              "Email already taken. Please try another email.",
              HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    if (registerRequestDto.getPhoneNumber()!=null && userDao.existsByPhoneNumber(registerRequestDto.getPhoneNumber())) {
      throw new ApiException(ErrorCode.USER_ALREADY_EXIST, "Phone number already registered", HttpStatus.UNPROCESSABLE_ENTITY);
    }

    User newUser = mapper.map(registerRequestDto, User.class);
    newUser.setPasswordHash(passwordEncoder.encode(registerRequestDto.getPassword()));
    userDao.save(newUser);
    return mapper.map(newUser, RegisterResponseDto.class);
  }
}

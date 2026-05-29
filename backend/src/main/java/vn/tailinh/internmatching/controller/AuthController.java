package vn.tailinh.internmatching.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.dto.request.user.LoginDTO;
import vn.tailinh.internmatching.dto.request.user.RegisterDTO;
import vn.tailinh.internmatching.dto.response.auth.LoginResponse;
import vn.tailinh.internmatching.dto.response.user.CreatedUserResponse;
import vn.tailinh.internmatching.exception.IdInvalidException;
import vn.tailinh.internmatching.security.SecurityUtils;
import vn.tailinh.internmatching.service.SecurityService;
import vn.tailinh.internmatching.service.UserService;
import vn.tailinh.internmatching.util.annotation.ApiMessage;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping(path = "${apiPrefix}/auth")
@RestController
@RequiredArgsConstructor
public class AuthController {
  private final AuthenticationManagerBuilder authenticationManagerBuilder;
  private final SecurityService securityService;
  private final UserService userService;
  private final SecurityUtils securityUtils;

  @Value("${tailinh.jwt.refresh-token-validity-in-seconds}")
  private long refreshTokenExpiration;

  @PostMapping("/register")
  @ApiMessage("Register a new user")
  public ResponseEntity<CreatedUserResponse> createUser(@Valid @RequestBody RegisterDTO dto) throws Exception {
    CreatedUserResponse newUser = this.userService.registerUser(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
  }



  @PostMapping(path = "/login")
  @ApiMessage("Login by credential")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginDTO loginDTO) {
    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
        loginDTO.getUsername(), loginDTO.getPassword());

    Authentication authentication = this.authenticationManagerBuilder.getObject().authenticate(authenticationToken);
    SecurityContextHolder.getContext().setAuthentication(authentication);
    LoginResponse loginResponse = new LoginResponse();

    User currentUserDB = this.userService.handleGetUserByUsername(loginDTO.getUsername());
    LoginResponse.RoleDTO roleDTO = new LoginResponse.RoleDTO();
    roleDTO.setId(currentUserDB.getRole().getId());
    roleDTO.setName(currentUserDB.getRole().getName());

    LoginResponse.UserLogin userLogin = new LoginResponse.UserLogin();
    if (currentUserDB != null) {
      userLogin.setId(currentUserDB.getId());
      userLogin.setEmail(currentUserDB.getEmail());
      userLogin.setName(currentUserDB.getName());
      userLogin.setAvatarUrl(currentUserDB.getAvatarUrl());

      if (currentUserDB.getCompany() != null) {
        LoginResponse.CompanyDTO company = new LoginResponse.CompanyDTO();
        company.setId(currentUserDB.getCompany().getId());
        company.setName(currentUserDB.getCompany().getName());
        userLogin.setCompany(company);
      }
      if (currentUserDB.getRole() != null) {
        userLogin.setRole(roleDTO);
      }

      loginResponse.setUser(userLogin);
    }
    // set access token
    loginResponse.setAccessToken(this.securityService.createAccessToken(authentication.getName(), loginResponse));
    // create refresh token
    String refreshToken = this.securityService.createRefreshToken(authentication.getName(), loginResponse);
    // update user
    this.userService.updateUserToken(refreshToken, loginDTO.getUsername());
    // set cookies
    ResponseCookie responseCookie = ResponseCookie
        .from("refresh_token", refreshToken)
        .httpOnly(true)
        .secure(true)
        .path("/")
        .maxAge(this.refreshTokenExpiration)
        .build();
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
        .body(loginResponse);
        
  }



  @GetMapping("/account")
  @ApiMessage("Get user information")
  public ResponseEntity<LoginResponse.UserLogin> getAccount() {
    Optional<String> optionalEmail = SecurityUtils.getCurrentUserLogin();
    String email = optionalEmail.orElse(" ");

    User currentUserDB = this.userService.handleGetUserByUsername(email);
    LoginResponse.UserLogin userLogin = new LoginResponse.UserLogin();

    if (currentUserDB != null) {
      userLogin.setId(currentUserDB.getId());
      userLogin.setEmail(currentUserDB.getEmail());
      userLogin.setName(currentUserDB.getName());
      userLogin.setAvatarUrl(currentUserDB.getAvatarUrl());

      if (currentUserDB.getCompany() != null) {
        LoginResponse.CompanyDTO company = new LoginResponse.CompanyDTO();
        company.setId(currentUserDB.getCompany().getId());
        company.setName(currentUserDB.getCompany().getName());
        userLogin.setCompany(company);
      }

      if (currentUserDB.getRole() != null) {
        LoginResponse.RoleDTO roleDTO = new LoginResponse.RoleDTO();
        roleDTO.setId(currentUserDB.getRole().getId());
        roleDTO.setName(currentUserDB.getRole().getName());
        userLogin.setRole(roleDTO);
      }
    }
    return ResponseEntity.ok().body(userLogin);
  }



  @PostMapping("/refresh")
  @ApiMessage("Refresh access token")
  public ResponseEntity<LoginResponse> getRefreshToken(
      @CookieValue("refresh_token") String refreshToken) throws IdInvalidException {
    Jwt decodedToken = this.securityUtils.checkValidRefreshToken(refreshToken);
    String email = decodedToken.getSubject();
    User user = this.userService.getUserByRefreshTokenAndEmail(refreshToken, email);

    if (user != null) {
      LoginResponse loginResponse = new LoginResponse();
      LoginResponse.UserLogin userLogin = new LoginResponse.UserLogin();
      userLogin.setId(user.getId());
      userLogin.setName(user.getName());
      userLogin.setEmail(user.getEmail());
      userLogin.setAvatarUrl(user.getAvatarUrl());

      if (user.getCompany() != null) {
        LoginResponse.CompanyDTO company = new LoginResponse.CompanyDTO();
        company.setId(user.getCompany().getId());
        company.setName(user.getCompany().getName());
        userLogin.setCompany(company);
      }

      if (user.getRole() != null) {
        LoginResponse.RoleDTO roleDTO = new LoginResponse.RoleDTO();
        roleDTO.setId(user.getRole().getId());
        roleDTO.setName(user.getRole().getName());
        userLogin.setRole(roleDTO);
      }
      loginResponse.setUser(userLogin);
      // set access token
      loginResponse.setAccessToken(this.securityService.createAccessToken(email, loginResponse));

      // create refresh token
      String newRefreshToken = this.securityService.createRefreshToken(email, loginResponse);
      // update user
      this.userService.updateUserToken(newRefreshToken, email);
      // set cookies
      ResponseCookie responseCookie = ResponseCookie
          .from("refresh_token", newRefreshToken)
          .httpOnly(true)
          .secure(true)
          .path("/")
          .maxAge(refreshTokenExpiration)
          .build();
      return ResponseEntity.ok()
          .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
          .body(loginResponse);
    } else {
      throw new IdInvalidException("Refresh token is not valid");
    }
  }



  @PostMapping("/logout")
  @ApiMessage("Logout user")
  public ResponseEntity<Void> logout() throws IdInvalidException {
    Optional<String> optionalEmail = SecurityUtils.getCurrentUserLogin();
    String email = optionalEmail.orElse("");

    if (email.isEmpty()) {
      throw new IdInvalidException("Access token is not valid");
    }
    this.userService.updateUserToken(null, email);

    ResponseCookie deleteSpringCookie = ResponseCookie
        .from("refresh_token")
        .httpOnly(true)
        .secure(true)
        .path("/")
        .maxAge(0)
        .build();
    return ResponseEntity.ok()
        .header(HttpHeaders.SET_COOKIE, deleteSpringCookie.toString())
        .body(null);
  }
}


package vn.tailinh.internmatching.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.dto.request.user.LoginDTO;
import vn.tailinh.internmatching.dto.response.auth.LoginResponse;
import vn.tailinh.internmatching.dto.response.user.CreatedUserResponse;
import vn.tailinh.internmatching.exception.IdInvalidException;
import vn.tailinh.internmatching.security.SecurityUtils;
import vn.tailinh.internmatching.service.SecurityService;
import vn.tailinh.internmatching.service.UserService;
import vn.tailinh.internmatching.util.annotation.ApiMessage;

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
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<CreatedUserResponse> createUser(@Valid @RequestBody User user) throws Exception {
        CreatedUserResponse newUser = this.userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    
    @PostMapping(path = "/login")
    @ApiMessage("Login by credential")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginDTO loginDTO){
        UsernamePasswordAuthenticationToken authenticationToken
                = new UsernamePasswordAuthenticationToken(loginDTO.getUsername(), loginDTO.getPassword());

        Authentication authentication =
                this.authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        SecurityContextHolder.getContext().setAuthentication(authentication);


        LoginResponse loginResponse = new LoginResponse();

        User currentUserDB = this.userService.handleGetUserByUsername(loginDTO.getUsername());
        if(currentUserDB != null){
            LoginResponse.UserLogin userLogin = new LoginResponse.UserLogin(
                    currentUserDB.getId(),
                    currentUserDB.getEmail(),
                    currentUserDB.getName(),
                    currentUserDB.getRole()
            );
            loginResponse.setUser(userLogin);
        }

        //set access token
        loginResponse.setAccessToken(this.securityService.createAccessToken(authentication.getName(), loginResponse));
        //create refresh token
        String refreshToken = this.securityService.createRefreshToken(authentication.getName(), loginResponse);
        //update user
        this.userService.updateUserToken(refreshToken, loginDTO.getUsername());
        //set cookies
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
    public ResponseEntity<LoginResponse.UserGetAccout> getAccount(){
        String email = SecurityUtils.getCurrentUserLogin().isPresent()
                ? SecurityUtils.getCurrentUserLogin().get()
                : "";
        User currentUserDB = this.userService.handleGetUserByUsername(email);
        LoginResponse.UserLogin userLogin = new LoginResponse.UserLogin();
        LoginResponse.UserGetAccout userGetAccout = new LoginResponse.UserGetAccout();
        if(currentUserDB != null){
            userLogin.setId(currentUserDB.getId());
            userLogin.setEmail(currentUserDB.getEmail());
            userLogin.setName(currentUserDB.getName());
            userLogin.setRole(currentUserDB.getRole());
            userGetAccout.setUser(userLogin);
        }
        return ResponseEntity.ok().body(userGetAccout);
    }





    @GetMapping("/refresh")
    @ApiMessage("Get user information")
    public ResponseEntity<LoginResponse> getRefreshToken(
            @CookieValue("refresh_token") String refreshToken
    ) throws IdInvalidException {
        Jwt decodedToken = this.securityUtils.checkValidRefreshToken(refreshToken);
        String email = decodedToken.getSubject();
        User user = this.userService.getUserByRefreshTokenAndEmail(refreshToken, email);
        if(user != null){
            LoginResponse loginResponse = new LoginResponse();
            LoginResponse.UserLogin userLogin = new LoginResponse.UserLogin();
                    userLogin.setId(user.getId());
                    userLogin.setName(user.getName());
                    userLogin.setEmail(user.getEmail());
                    userLogin.setRole(user.getRole());
            loginResponse.setUser(userLogin);

            //set access token
            loginResponse.setAccessToken(this.securityService.createAccessToken(email, loginResponse));
            //create refresh token
            String new_refresh_token = this.securityService.createRefreshToken(email, loginResponse);
            //update user
            this.userService.updateUserToken(new_refresh_token, email);
            //set cookies
            ResponseCookie responseCookie = ResponseCookie
                    .from("refresh_token", new_refresh_token)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(refreshTokenExpiration)
                    .build();
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, responseCookie.toString())
                    .body(loginResponse);
        }else{
            throw new IdInvalidException("Refresh token is not valid");
        }
    }





    @PostMapping("/logout")
    @ApiMessage("Logout user")
    public ResponseEntity<Void> logout() throws IdInvalidException{
        String email = SecurityUtils.getCurrentUserLogin().isPresent()
                ? SecurityUtils.getCurrentUserLogin().get()
                : "";
        if(email.equals("")){
            throw new IdInvalidException("Access token is not valid");
        }
        this.userService.updateUserToken(null, email);

        ResponseCookie deleteSpringCookie = ResponseCookie
                .from("refresh_token", null)
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

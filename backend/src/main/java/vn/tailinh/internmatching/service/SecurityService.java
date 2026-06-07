package vn.tailinh.internmatching.service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.dto.response.auth.LoginResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SecurityService {
  public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS256;
  private final JwtEncoder jwtEncoder;

  @Value("${tailinh.jwt.base64-secret}")
  private String jwtKey;

  @Value("${tailinh.jwt.access-token-validity-in-seconds}")
  private long accessTokenExpiration;

  @Value("${tailinh.jwt.refresh-token-validity-in-seconds}")
  private long refreshTokenExpiration;

  public String createAccessToken(String email, LoginResponse loginResponse) {
    LoginResponse.UserInsideToken userToken = new LoginResponse.UserInsideToken();
    userToken.setId(loginResponse.getUser().getId());
    userToken.setName(loginResponse.getUser().getName());
    userToken.setEmail(loginResponse.getUser().getEmail());

    Instant now = Instant.now();
    Instant validity = now.plus(this.accessTokenExpiration, ChronoUnit.SECONDS);

    List<String> roles = new ArrayList<>();
    if (loginResponse.getUser().getRole() != null) {
      roles.add("ROLE_" + loginResponse.getUser().getRole().getName());
    } else {
      roles.add("ROLE_USER"); // fallback
    }

    // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(email)
                .claim("roles", roles)
                .claim("user", userToken)
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    public String createRefreshToken(String email, LoginResponse loginResponse) {
        LoginResponse.UserInsideToken userToken = new LoginResponse.UserInsideToken();
        userToken.setId(loginResponse.getUser().getId());
        userToken.setName(loginResponse.getUser().getName());
        userToken.setEmail(loginResponse.getUser().getEmail());
        Instant now = Instant.now();
        Instant validity = now.plus(this.refreshTokenExpiration, ChronoUnit.SECONDS);

        List<String> roles = new ArrayList<>();
        if (loginResponse.getUser().getRole() != null) {
        roles.add("ROLE_" + loginResponse.getUser().getRole().getName());
        } else {
        roles.add("ROLE_USER"); // fallback
        }

        // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(email)
                .claim("roles", roles)
                .claim("user", userToken)
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }
}

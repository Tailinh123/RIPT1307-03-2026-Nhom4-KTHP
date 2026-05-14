package vn.tailinh.internmatching.dto.response.auth;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tailinh.internmatching.entity.Role;

@Getter
@Setter
public class LoginResponse {
    @JsonProperty("access_token")
    private String accessToken;
    private UserLogin user;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserLogin{
        private Long id;
        private String email;
        private String name;
        private Role role;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserGetAccout {
        private UserLogin user;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInsideToken{
        private Long id;
        private String email;
        private String name;

        // List permissions làm menu ẩn/hiện
        private java.util.List<String> permissions;
    }
}

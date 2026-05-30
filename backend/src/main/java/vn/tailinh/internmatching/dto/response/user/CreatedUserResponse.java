package vn.tailinh.internmatching.dto.response.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tailinh.internmatching.entity.Role;
import vn.tailinh.internmatching.util.constant.Gender;

import java.time.Instant;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CreatedUserResponse {
    private Long id;

    private String name;

    private LocalDate dateOfBirth;

    private String phone;

    private String email;

    private String address;

    private Gender gender;

//    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss a", timezone = "GMT+7")
    private Instant createdAt;
    private String createdBy;
    private CompanyUser company;
    private Role role;
    private String avatarUrl;
    private boolean active;
}

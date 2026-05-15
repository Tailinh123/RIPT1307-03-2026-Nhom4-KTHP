package vn.tailinh.internmatching.dto.response.user;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tailinh.internmatching.entity.Role;
import vn.tailinh.internmatching.util.constant.Gender;

import java.time.Instant;
import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdatedUserResponse {
    private Long id;

    private String name;

    private LocalDate dateOfBirth;

    private String address;

    private Gender gender;

    private Instant createdAt;
    private Instant updatedAt;
    private String createBy;
    private String updatedBy;
    private CompanyUser company;

    private Role role;
}

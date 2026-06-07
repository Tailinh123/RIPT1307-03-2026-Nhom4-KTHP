package vn.tailinh.internmatching.dto.request.user;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tailinh.internmatching.entity.Company;
import vn.tailinh.internmatching.entity.Role;
import vn.tailinh.internmatching.entity.Skill;
import vn.tailinh.internmatching.util.constant.Gender;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserDTO {
  private Long id;

  @NotBlank(message = "Tên không được để trống")
  private String name;

  @PastOrPresent(message = "Ngày sinh phải là ngày trong quá khứ")
  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate dateOfBirth;

  private String address;

  private Gender gender;

  private Company company;

  private String avatarUrl;

  @Pattern(regexp = "^$|^(0|\\+84)[0-9]{9}$", message = "Số điện thoại không hợp lệ (VD: 0912345678 hoặc +84912345678)")
  private String phone;

  private Role role;

  private Boolean active;

  private List<Skill> skills;
}

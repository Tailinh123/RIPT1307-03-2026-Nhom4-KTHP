package vn.tailinh.internmatching.dto.request.user;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
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

  @NotBlank(message = "Name cannot be blank")
  private String name;

  @Past(message = "Date of birth must be in the past")
  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate dateOfBirth;

  private String address; 

  private Gender gender;

  private Company company;
  
  private String avatarUrl;

  private String phone;

  private Role role;

  private List<Skill> skills;
}

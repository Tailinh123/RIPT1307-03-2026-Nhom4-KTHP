package vn.tailinh.internmatching.dto.response.user;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tailinh.internmatching.entity.Skill;
import vn.tailinh.internmatching.util.constant.Gender;
@Setter
@Getter
@NoArgsConstructor
public class ResUserDTO {
  
  private Long id;

  private String name;

  private String email;

  private LocalDate dateOfBirth;

  private Gender gender;

  private String address;

  private String phone;

  private String avatarUrl;

  private boolean isSubscribed;

  private CompanyDTO company;

  private RoleDTO role;

  private List<Skill> skills;

  
  @Setter
  @Getter
  @NoArgsConstructor
  public static class CompanyDTO {
    private Long id;
    private String name;
  }
  @Setter
  @Getter
  @NoArgsConstructor
  public static class RoleDTO{
    private Long id;
    private String name;
  }

}

package vn.tailinh.internmatching.dto.response.user;

import java.time.LocalDate;


import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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


  private boolean isSubscribed;


  private CompanyDTO company;
  private RoleDTO role;
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

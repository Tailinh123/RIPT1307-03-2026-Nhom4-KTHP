package vn.tailinh.internmatching.dto.request.application;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tailinh.internmatching.util.constant.ApplicationStatus;

@Setter
@Getter
public class UpdateApplicationDTO {
  private Long id;

  private ApplicationStatus status;

  private String note;
  private UserDTO user;
  private ResumeDTO resume;
  private JobDTO job;



  
  @Setter
  @Getter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class UserDTO{
    private Long id;
    private String email;
  }

  @Setter
  @Getter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ResumeDTO{
    private Long id;
    private String url;
  }

    @Setter
  @Getter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class JobDTO{
    private Long id;
    private String name;
  }
}

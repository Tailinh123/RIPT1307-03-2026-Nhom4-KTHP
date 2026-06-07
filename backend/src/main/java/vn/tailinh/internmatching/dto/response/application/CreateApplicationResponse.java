package vn.tailinh.internmatching.dto.response.application;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import vn.tailinh.internmatching.util.constant.ApplicationStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateApplicationResponse {
  private Long id;
  private ApplicationStatus status;
  private String note;

  private Instant createdAt;
  private Instant updatedAt;
  private String createdBy;
  private String updatedBy;

  private JobDTO job;
  private ResumeDTO resume;

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ResumeDTO {
    private Long id;
    private String title;
    private String url;
  }

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class JobDTO {
    private Long id;
    private String name;
  }

}

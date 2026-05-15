package vn.tailinh.internmatching.dto.response.application;

import java.time.Instant;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tailinh.internmatching.util.constant.ApplicationStatus;

@Getter
@Setter
public class FetchApplicationResponse {
  private Long id;
  private String name;
  private ApplicationStatus status;
  private String note;
  private Instant createdAt;
  private Instant updatedAt;
  private String updatedBy;
  private String createdBy;

  private JobDTO job;
  private ResumeDTO resume;

  
  @NoArgsConstructor
  @Getter
  @Setter
  @AllArgsConstructor
  public static class JobDTO {
    private Long id;
  }

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ResumeDTO {
  
  private Long id;
  private String title;
  private String url;

}
}

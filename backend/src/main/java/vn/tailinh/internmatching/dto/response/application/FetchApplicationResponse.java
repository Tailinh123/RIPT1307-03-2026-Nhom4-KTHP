package vn.tailinh.internmatching.dto.response.application;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tailinh.internmatching.util.constant.ApplicationStatus;
import vn.tailinh.internmatching.util.constant.Gender;

@Getter
@Setter
public class FetchApplicationResponse {
  private Long id;
  private ApplicationStatus status;
  private String note;
  private Instant createdAt;
  private Instant updatedAt;
  private String updatedBy;
  private String createdBy;

  private String applicantName;
  private String applicantEmail;
  private String jobTitle;
  private String jobName;

  private JobDTO job;
  private ResumeDTO resume;

  @NoArgsConstructor
  @AllArgsConstructor
  @Getter
  @Setter
  public static class JobDTO {
    private Long id;
    private String name;
    private String location;
    private String level;
    private String workMode;
    private CompanyDTO company;
  }

  @NoArgsConstructor
  @AllArgsConstructor
  @Getter
  @Setter
  public static class CompanyDTO {
    private Long id;
    private String name;
    private String logoUrl;
  }

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class ResumeDTO {
    private Long id;
    private String title;
    private String url;
    private UserDTO user;
  }

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String address;
    private String avatarUrl;
    private List<SkillDTO> skills;
  }

  @Getter
  @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  public static class SkillDTO {
    private Long id;
    private String name;
  }
}

package vn.tailinh.internmatching.dto.response.resume;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class UpdatedResumeResponse {
  private Instant updatedAt;
  private String updatedBy;

}

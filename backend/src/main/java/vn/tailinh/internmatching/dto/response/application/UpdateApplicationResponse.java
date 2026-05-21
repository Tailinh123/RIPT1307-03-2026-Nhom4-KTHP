package vn.tailinh.internmatching.dto.response.application;

import java.time.Instant;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateApplicationResponse {
  private Instant updatedAt;
  private String updatedBy;
}

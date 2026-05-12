package vn.tailinh.internmatching.dto.response.resume;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class CreatedResumeResponse {
    private Long id;
    private Instant createdAt;
    private String createdBy;
}

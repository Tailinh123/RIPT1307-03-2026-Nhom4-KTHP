package vn.tailinh.internmatching.dto.response.resume;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class FetchResumeResponse {
    private Long id;
    private String title;
    private String url;
    private UserResume user;
    private Instant createdAt;
    private Instant updatedAt;
    private String updatedBy;
    private String createdBy;
    @Getter
    @Setter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserResume{
        private Long id;
        private String name;
        private String avatarUrl;
    }

    
}

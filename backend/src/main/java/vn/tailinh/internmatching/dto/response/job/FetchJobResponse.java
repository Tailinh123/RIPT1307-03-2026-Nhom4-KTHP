package vn.tailinh.internmatching.dto.response.job;


import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tailinh.internmatching.util.constant.JobType;
import vn.tailinh.internmatching.util.constant.Level;
import vn.tailinh.internmatching.util.constant.WorkMode;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class FetchJobResponse {
    private Long id;
    private String name;
    private String description;
    private String location;
    private int quantity;
    private BigDecimal salary;
    private JobType jobType;
    private WorkMode workMode;
    private Level level;
    private boolean active;
    private Instant startDate;
    private Instant endDate;
    private Instant createdAt;
    private Instant updatedAt;
    
    private CompanyInfo company; 
    private CategoryInfo jobCategory;
    private List<SkillInfo> skills;
    
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class CompanyInfo {
        private Long id;
        private String name;
        private String logoUrl;
    }
    
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class CategoryInfo {
        private Long id;
        private String name;
    }
    
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    public static class SkillInfo {
        private Long id;
        private String name;
    }
}

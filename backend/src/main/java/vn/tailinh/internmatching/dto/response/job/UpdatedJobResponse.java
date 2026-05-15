package vn.tailinh.internmatching.dto.response.job;

import lombok.Getter;
import lombok.Setter;
import vn.tailinh.internmatching.util.constant.JobType;
import vn.tailinh.internmatching.util.constant.Level;
import vn.tailinh.internmatching.util.constant.WorkMode;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
public class UpdatedJobResponse {
    private Long id;
    private String name;
    private String location;
    private BigDecimal salary;
    private int quantity;
    private Level level;
    private JobType jobType;
    private WorkMode workMode;
    private boolean isActive;
    private String description;
    private Instant startDate;
    private Instant endDate;
    private String updatedBy;
    private Instant updatedAt;

    
    private List<String> skills;
}

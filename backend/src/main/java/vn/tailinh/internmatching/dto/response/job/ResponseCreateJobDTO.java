package vn.tailinh.internmatching.dto.response.job;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tailinh.internmatching.util.constant.Level;
import vn.tailinh.internmatching.util.constant.WorkMode;
import vn.tailinh.internmatching.util.constant.JobType;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ResponseCreateJobDTO {
  private Long id;
  private String name;
  private String description;
  private String location;
  private boolean isActive;
  private Level level;
  private int quantity;
  private BigDecimal salary;
  private BigDecimal requiredGpa;
  private Instant startDate;
  private Instant endDate;
  private JobType jobType;
  private WorkMode workMode;


  // Bộ 4 Audit Fields 
  private Instant createdAt;
  private String createdBy;
  private CompanyDTO company;
  private CategoryDTO category;

  
  //Flattern  trả về 
  private List<String> skills;
  @Getter
  @Setter
  @NoArgsConstructor
  public static class CompanyDTO{
    private Long id;
    private String name;
  }
  
  @Getter
  @Setter
  @NoArgsConstructor
  public static class CategoryDTO{
    private Long id;
    private String name;
  }


}

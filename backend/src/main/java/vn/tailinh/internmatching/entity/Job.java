package vn.tailinh.internmatching.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import vn.tailinh.internmatching.util.constant.JobType;
import vn.tailinh.internmatching.util.constant.Level;
import vn.tailinh.internmatching.util.constant.WorkMode;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "jobs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class Job extends AbstractAuditingEntity<Long> {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank(message = "Name is required")
  private String name;

  @Column(columnDefinition = "TEXT")
  private String description;

  @NotBlank(message = "Location is required")
  private String location;

  private boolean active;

  @Min(1)
  private int quantity;

  @Column(name = "salary", precision = 15, scale = 2)
  private BigDecimal salary;

  @Enumerated(EnumType.STRING)
  @Column(name = "job_type")
  private JobType jobType;

  @Enumerated(EnumType.STRING)
  @Column(name = "work_mode")
  private WorkMode workMode;

  @FutureOrPresent(message = "Start date must be in future")
  private Instant startDate;

  @FutureOrPresent(message = "End date must be in future")
  private Instant endDate;

  @Enumerated(EnumType.STRING)
  private Level level;

  @ManyToOne
  @JoinColumn(name = "company_id")
  private Company company;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "category_id")
  private JobCategory jobCategory;

  @ManyToMany(fetch = FetchType.LAZY)
  @JsonIgnoreProperties(value = { "jobs" })
  @JoinTable(name = "job_skill", joinColumns = @JoinColumn(name = "job_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
  private List<Skill> skills;

  @OneToMany(mappedBy = "job", fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Application> applications;
}

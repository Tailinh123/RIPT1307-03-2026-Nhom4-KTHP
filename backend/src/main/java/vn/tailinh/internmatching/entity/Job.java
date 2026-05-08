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
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import vn.tailinh.internmatching.util.constant.Level;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Entity
@Table(name="jobs")
@Getter
@Setter
public class Job extends AbstractAuditingEntity<Long>{
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;
    
    @Column(columnDefinition = "MEDIUMTEXT")
    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    private boolean active;

    @Enumerated(EnumType.STRING)
    private Level level;

    private int quantity;


    @Column(name = "salary" , precision = 15 , scale = 2 )
    private BigDecimal salary;

    @Column(name = "required_gpa" , precision = 3 , scale = 2)
    private BigDecimal requiredGpa;

    private Instant startDate;

    private Instant endDate;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    // job_skill
    @ManyToMany(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = {"jobs"})
    @JoinTable(name = "job_skill", joinColumns = @JoinColumn(name = "job_id"),
    inverseJoinColumns = @JoinColumn(name="skill_id"))
    private List<Skill> skills;

    @OneToMany(mappedBy = "job", fetch = FetchType.LAZY)
    @JsonIgnore
    List<Application> applications;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private JobCategory jobCategory;
}

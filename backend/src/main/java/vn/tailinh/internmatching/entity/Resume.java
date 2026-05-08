package vn.tailinh.internmatching.entity;

import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Resume extends AbstractAuditingEntity<Long> {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  // @NotBlank(message = "Tittle is required")
  private String title;

  private String education;

  @NotBlank(message = "Url is required")
  private String url;

  @NotBlank(message = "Gpa is required")
  @NotNull
  @Column(name = "gpa", precision = 3, scale = 2)
  private BigDecimal gpa;

  @ManyToOne(fetch = FetchType.LAZY)
  @JsonIgnore
  @JoinColumn(name = "user_id")
  private User user;

  @OneToMany(mappedBy = "resume" , fetch = FetchType.LAZY)
  @JsonIgnore
  private List<Application> applications;
}

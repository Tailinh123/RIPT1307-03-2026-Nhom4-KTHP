package vn.tailinh.internmatching.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tailinh.internmatching.util.constant.ApplicationStatus;


  @Entity
  @Getter @Setter
  @NoArgsConstructor
  @AllArgsConstructor
  @Table(name = "applications", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"resume_id", "job_id"})
})

public class Application extends AbstractAuditingEntity<Long> {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(columnDefinition = "TEXT")
  private String note;

  @Enumerated(EnumType.STRING)
  @Column(name = "status")
  private ApplicationStatus status = ApplicationStatus.PENDING;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "resume_id" , nullable = false)
  private Resume resume;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "job_id" , nullable = false)
  private Job job;
}

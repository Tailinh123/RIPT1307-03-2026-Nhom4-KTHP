package vn.tailinh.internmatching.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

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
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tailinh.internmatching.util.constant.Gender;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class User extends AbstractAuditingEntity<Long> {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", length = 100)
  private String name;

  @Column(name = "email", length = 255, nullable = false)
  @NotBlank(message = "Email is required")
  @NotNull(message = "Email cannot be null")
  @Email(message = "Please provide a valid email address")
  private String email;

  @Column(name = "password", length = 200)
  @NotBlank(message = "Password cannot be blank")
  @NotNull(message = "Password cannot be null")
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;

  @Column(name = "date_of_birth")
  private LocalDate dateOfBirth;

  @Enumerated(EnumType.STRING)
  @Column(name = "gender")
  private Gender gender;

  @Column(name = "address", length = 200)
  private String address;

  @Column(name = "refresh_token", columnDefinition = "MEDIUMTEXT")
  @JsonIgnore
  private String refreshToken;


  @Column(name = "student_code" , length = 20)
  private String studentCode;

  @NotBlank
  @NotNull
  @Column(name = "is_subscribed")
  private boolean isSubscriber;




  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "company_id")
  private Company company;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
  @JsonIgnore
  List<Resume> resumes;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "role_id")
  private Role role;

  @OneToMany(mappedBy = "user")
  @JsonIgnore
  private List<EmailLog> emailLogs;

  @ManyToMany(fetch = FetchType.LAZY)
  @JsonIgnore
  @JoinTable(name = "user_skill", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "skill_id"))
  private List<Skill> skills;

}

package vn.tailinh.internmatching.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
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
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.tailinh.internmatching.util.constant.Gender;

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
  @NotBlank(message = "Name is required")
  private String name;

  @Column(name = "email", length = 255, nullable = false , unique = true)
  @NotBlank(message = "Email is required")
  @Email(message = "Please provide a valid email address")
  private String email;

  @Column(name = "password", length = 200)
  @NotBlank(message = "Password cannot be blank")
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  private String password;

  @Column(name = "date_of_birth")
  private LocalDate dateOfBirth;

  @Column(name = "address", length = 200)
  private String address;

  @Column(name = "phone", length = 15)
  @Pattern(regexp = "^(0|\\+84)[0-9]{9}$")
  private String phone;


  @Column(name = "is_subscribed")
  private boolean isSubscribed;

  @Column(name = "refresh_token", columnDefinition = "TEXT")
  @JsonIgnore
  private String refreshToken;

  @Enumerated(EnumType.STRING)
  @Column(name = "gender")
  private Gender gender;

  @Column(name = "avatar")
  private String avatarUrl;

  @Column(name = "is_active")
  private boolean active = true;

  
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "company_id")
  private Company company;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "role_id" , nullable = false)
  private Role role;

  @OneToMany(mappedBy = "user", fetch = FetchType.LAZY )
  @JsonIgnore
  private List<Resume> resumes;

  @OneToMany(mappedBy = "user")
  @JsonIgnore
  private List<EmailLog> emailLogs;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(name = "user_skills",
          joinColumns = @JoinColumn(name = "user_id"),
          inverseJoinColumns = @JoinColumn(name = "skill_id"))
  private List<Skill> skills;



}

package vn.tailinh.internmatching.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Permission extends AbstractAuditingEntity<Long> {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(unique = true )
  @NotBlank(message = "Name is required")
  private String name;

  @NotBlank(message = "API Path is required")
  @Column(name = "api_path")
  private String apiPath;

  @NotBlank(message = "Method is required")
  private String method;

  @NotBlank(message = "Module is required")
  private String module;

  @ManyToMany(fetch = FetchType.LAZY, mappedBy = "permissions")
  @JsonIgnore
  private List<Role> roles;

}

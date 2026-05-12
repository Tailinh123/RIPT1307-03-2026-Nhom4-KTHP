package vn.tailinh.internmatching.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "companies")
@AllArgsConstructor @NoArgsConstructor @Getter @Setter

public class Company extends AbstractAuditingEntity<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name" ,length = 100, nullable = false)
    @NotBlank(message = "Name cannot be blank")
    private String name;

    @Column(name = "description" , columnDefinition = "TEXT")
    @JsonProperty("description")
    private String description;

    @Column(name = "address" , length = 255)
    @JsonProperty("address")
    private String address;

    @Column(name = "logo")
    @JsonProperty("logo")
    private String logoUrl;

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<User> users;

    @OneToMany(mappedBy = "company", fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Job> jobs;
    
}

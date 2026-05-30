package vn.tailinh.internmatching.dto.request.user;


import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDTO {
  @NotBlank(message = "Name is required")
  private String name;

  @NotBlank(message = "Please provide a valid email address")
  private String email;

  @NotBlank(message = "Password cannot be blank")
  private String password;

  private Long companyId;

}

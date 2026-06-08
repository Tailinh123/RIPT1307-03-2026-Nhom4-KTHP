package vn.tailinh.internmatching.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateUserDTO {
  @NotBlank(message = "Name is required")
  private String name;

  @NotBlank(message = "Please provide a valid email address")
  private String email;

  @NotBlank(message = "Password cannot be blank")
  private String password;

  private Long companyId;
  private Long roleId;
}

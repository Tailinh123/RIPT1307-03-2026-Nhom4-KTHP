package vn.tailinh.internmatching.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.dto.request.user.RegisterDTO;
import vn.tailinh.internmatching.dto.request.user.ChangePasswordDTO;
import vn.tailinh.internmatching.dto.request.user.UpdateUserDTO;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.dto.response.user.CreatedUserResponse;
import vn.tailinh.internmatching.dto.response.user.ResUserDTO;
import vn.tailinh.internmatching.dto.response.user.UpdatedUserResponse;
import vn.tailinh.internmatching.service.UserService;
import vn.tailinh.internmatching.util.annotation.ApiMessage;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping(path = "${apiPrefix}/users")
@RestController
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  @PostMapping("")
  @ApiMessage("Create a user")
  public ResponseEntity<CreatedUserResponse> createUser(@Valid @RequestBody RegisterDTO user) throws Exception {
    CreatedUserResponse newUser = this.userService.createUser(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(newUser);

  }

  @GetMapping("")
  @ApiMessage("Fetch all user data")
  public ResponseEntity<ResultPaginationResponse> getAllUser(
      @Filter Specification<User> spec,
      Pageable pageable) {
    return ResponseEntity.status(HttpStatus.OK)
        .body(this.userService.getAllUser(pageable, spec));
  }

  @GetMapping("/{id}")
  @ApiMessage("Fetch user by id")
  public ResponseEntity<ResUserDTO> fetchCompanyById(
      @PathVariable("id") Long id) throws Exception {
    return ResponseEntity.ok(this.userService.fetchUserById(id));
  }

  @PutMapping("/{id}")
  @ApiMessage("Update a user")
  public ResponseEntity<UpdatedUserResponse> updateUser(
      @PathVariable("id") Long id,
      @Valid @RequestBody UpdateUserDTO user) throws Exception {
    return ResponseEntity.ok(this.userService.updateUser(id, user));
  }

  @DeleteMapping("/{id}")
  @ApiMessage("Delete a user")
  public ResponseEntity<Void> deleteUser(
      @PathVariable("id") Long id) throws Exception {
    this.userService.deleteUser(id);
    return ResponseEntity.ok(null);
  }

  @PutMapping("/change-password")
  @ApiMessage("Change password")
  public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordDTO req) throws Exception {
    this.userService.changePassword(req);
    return ResponseEntity.ok(null);

  }
}

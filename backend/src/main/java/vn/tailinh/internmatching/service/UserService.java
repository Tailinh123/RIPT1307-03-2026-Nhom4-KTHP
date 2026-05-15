package vn.tailinh.internmatching.service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.dto.request.user.ChangePasswordDTO;
import vn.tailinh.internmatching.dto.request.user.UpdateUserDTO;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.dto.response.user.CreatedUserResponse;
import vn.tailinh.internmatching.dto.response.user.ResUserDTO;
import vn.tailinh.internmatching.dto.response.user.UpdatedUserResponse;
import vn.tailinh.internmatching.exception.IdInvalidException;
import vn.tailinh.internmatching.repository.UserRepository;
import vn.tailinh.internmatching.security.SecurityUtils;
import vn.tailinh.internmatching.util.mapper.UserMapper;
import vn.tailinh.internmatching.util.response.FormatResultPagaination;
import vn.tailinh.internmatching.entity.Company;
import vn.tailinh.internmatching.entity.Role;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final CompanyService companyService;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;

    public CreatedUserResponse createUser(User user) throws Exception {
        String email = user.getEmail();

        if(user.getCompany() != null){
            Company company = this.companyService.findCompanyById(user.getCompany().getId());
            user.setCompany(company);
        }

        if(userRepository.existsByEmail(email)) {
            throw new DataIntegrityViolationException("Email already exists");
        }

        if(user.getRole() != null){
            Role role = this.roleService.fetchRoleById(user.getRole().getId());
            user.setRole(role);
        }

        String hashPassword = this.passwordEncoder.encode(user.getPassword());
        user.setPassword(hashPassword);

        return UserMapper.convertToResCreatedUserRes(this.userRepository.save(user));
    }


    
    public ResUserDTO fetchUserById(Long id) throws Exception {
        if(userRepository.existsById(id)){
            return UserMapper.convertToUserDTO(this.userRepository.findById(id).get());
        }else{
            throw new IdInvalidException("The specified User ID is invalid");
        }
    }



    public void deleteUser(Long id) throws Exception {
        if(this.userRepository.existsById(id)){
            this.userRepository.deleteById(id);
        }else{
         throw new IdInvalidException("The specified User ID is invalid");
        }
    }



    public User handleGetUserByUsername(String username) {
        return this.userRepository.findByEmail(username);
    }



    public ResultPaginationResponse getAllUser(Pageable pageable, Specification<User> spec){
        Page<User> userPage = this.userRepository.findAll(spec, pageable);

        return FormatResultPagaination.createPaginateUserRes(userPage);
    }



    public UpdatedUserResponse updateUser(Long id, UpdateUserDTO requestUser) throws Exception {
        Optional<User> userOptional = this.userRepository.findById(id);
        if(userOptional.isPresent()){
            User currentUser = userOptional.get();
            currentUser.setName(requestUser.getName());
            currentUser.setGender(requestUser.getGender());
            currentUser.setAddress(requestUser.getAddress());
            currentUser.setDateOfBirth(requestUser.getDateOfBirth());
            if(requestUser.getCompany() != null){
                Company company = this.companyService.findCompanyById(requestUser.getCompany().getId());
                if(company == null){
                    throw new IdInvalidException("Company Id is invalid");
                }
                currentUser.setCompany(company);
            }
            if(requestUser.getRole() != null){
                Role role = this.roleService.fetchRoleById(requestUser.getRole().getId());
                currentUser.setRole(role);
            }

            return UserMapper.convertToResUpdatedUserRes(this.userRepository.save(currentUser));
        }
        throw new IdInvalidException("User ID = " + id + " not found");
    }



    public void updateUserToken(String token, String email){
        User user = this.handleGetUserByUsername(email);
        if(user != null){
            user.setRefreshToken(token);
            this.userRepository.save(user);
        }
    }



    public User getUserByRefreshTokenAndEmail(String token, String email){
        return this.userRepository.findByRefreshTokenAndEmail(token, email);
    }


    public void changePassword(ChangePasswordDTO dto) throws Exception {
      String email = SecurityUtils.getCurrentUserLogin().isPresent() ? SecurityUtils.getCurrentUserLogin().get() : "";
      User user = this.handleGetUserByUsername(email);
      if(user == null) throw new IdInvalidException("User not found");

      if(passwordEncoder.matches(dto.getCurrentPassword(),user.getPassword())) {
          throw new IdInvalidException("Current Password is incorrect");
      } 
      if(!dto.getNewPassword().equals(dto.getConfirmPassword())) {
        throw new IdInvalidException("Passwords do not match");
      }

      user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
      this.userRepository.save(user);

    
}

}
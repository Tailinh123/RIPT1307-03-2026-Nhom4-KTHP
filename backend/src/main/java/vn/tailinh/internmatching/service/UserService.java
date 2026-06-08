package vn.tailinh.internmatching.service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.dto.request.user.ChangePasswordDTO;
import vn.tailinh.internmatching.dto.request.user.CreateUserDTO;
import vn.tailinh.internmatching.dto.request.user.RegisterDTO;
import vn.tailinh.internmatching.dto.request.user.UpdateUserDTO;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.dto.response.user.CreatedUserResponse;
import vn.tailinh.internmatching.dto.response.user.ResUserDTO;
import vn.tailinh.internmatching.dto.response.user.UpdatedUserResponse;
import vn.tailinh.internmatching.exception.IdInvalidException;
import vn.tailinh.internmatching.repository.SkillRepository;
import vn.tailinh.internmatching.repository.UserRepository;
import vn.tailinh.internmatching.security.SecurityUtils;
import vn.tailinh.internmatching.util.mapper.UserMapper;
import vn.tailinh.internmatching.util.response.FormatResultPagination;
import vn.tailinh.internmatching.entity.Company;
import vn.tailinh.internmatching.entity.Role;
import vn.tailinh.internmatching.entity.Skill;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final CompanyService companyService;
    private final PasswordEncoder passwordEncoder;
    private final RoleService roleService;
    private final SkillRepository skillRepository;

    public CreatedUserResponse createUser(CreateUserDTO dto) throws Exception {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IdInvalidException("Email already exists");
        }
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setActive(true);

        if (dto.getCompanyId() != null) {
            Company company = this.companyService.findCompanyById(dto.getCompanyId());
            if (company == null) {
                throw new IdInvalidException("Company Id is invalid");
            }
            user.setCompany(company);
        }

        if (dto.getRoleId() != null) {
            Role role = this.roleService.fetchRoleById(dto.getRoleId());
            if (role == null) {
                throw new IdInvalidException("Role Id is invalid");
            }
            user.setRole(role);
        } else {
            Role userRole = this.roleService.fetchRoleByName("CANDIDATE");
            if (userRole == null) {
                throw new IdInvalidException("Default role CANDIDATE not found in system");
            }
            user.setRole(userRole);
        }

        return UserMapper.convertToResCreatedUserRes(this.userRepository.save(user));
    }

    public CreatedUserResponse registerUser(RegisterDTO dto) throws Exception {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new DataIntegrityViolationException("Email already exists");
        }
        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setActive(true);

        if (dto.getCompanyId() != null) {
            // registration: assign company + role
            Company company = this.companyService.findCompanyById(dto.getCompanyId());
            if (company == null) {
                throw new IdInvalidException("Company Id is invalid");
            }
            user.setCompany(company);

            Role hrRole = this.roleService.fetchRoleByName("HR_MANAGER");
            if (hrRole == null) {
                throw new IdInvalidException("Role HR_MANAGER not found in system");
            }
            user.setRole(hrRole);
        } else {
            // default registration candidate role
            Role userRole = this.roleService.fetchRoleByName("CANDIDATE");
            if (userRole == null) {
                throw new IdInvalidException("Default role CANDIDATE not found in system");
            }
            user.setRole(userRole);
        }

        return UserMapper.convertToResCreatedUserRes(this.userRepository.save(user));
    }

    public ResUserDTO fetchUserById(Long id) throws Exception {
        if (userRepository.existsById(id)) {
            return UserMapper.convertToUserDTO(this.userRepository.findById(id).get());
        } else {
            throw new IdInvalidException("The specified User ID is invalid");
        }
    }

    public ResUserDTO fetchCurrentUserProfile() throws Exception {
        String email = SecurityUtils.getCurrentUserLogin().orElse("");
        if (email.isEmpty()) {
            throw new IdInvalidException("Access token is not valid or expired");
        }

        User currentUser = this.handleGetUserByUsername(email);
        if (currentUser == null) {
            throw new IdInvalidException("User not found");
        }
        if (!currentUser.isActive() || currentUser.getRole() == null || !currentUser.getRole().isActive()) {
            throw new IdInvalidException("Account is inactive");
        }

        return UserMapper.convertToUserDTO(currentUser);
    }

    @Transactional
    public UpdatedUserResponse updateCurrentUserProfile(UpdateUserDTO requestUser) throws Exception {
        // get emal from currentuserLogin
        String email = SecurityUtils.getCurrentUserLogin().orElse("");
        if (email.isEmpty()) {
            throw new IdInvalidException("Access token is not valid or expried");
        }

        User currentUser = this.handleGetUserByUsername(email);
        if (currentUser == null) {
            throw new IdInvalidException("User not found");
        }
        if (!currentUser.isActive() || currentUser.getRole() == null || !currentUser.getRole().isActive()) {
            throw new IdInvalidException("Account is inactive");
        }

        currentUser.setName(requestUser.getName());
        currentUser.setGender(requestUser.getGender());
        currentUser.setAddress(requestUser.getAddress());
        currentUser.setDateOfBirth(requestUser.getDateOfBirth());
        if (requestUser.getPhone() != null) {
            currentUser.setPhone(requestUser.getPhone().isEmpty() ? null : requestUser.getPhone());
        }
        if (requestUser.getAvatarUrl() != null) {
            currentUser.setAvatarUrl(requestUser.getAvatarUrl());
        }

        String roleName = currentUser.getRole().getName();
        if (roleName.equals("HR_MANAGER")) {
            // hr save company
            if (requestUser.getCompany() != null) {
                Company company = this.companyService.findCompanyById(requestUser.getCompany().getId());
                if (company == null) {
                    throw new IdInvalidException("Company Id is invalid");
                }
                currentUser.setCompany(company);
            }
            currentUser.setSkills(null); // clkear data Candidate when up Company
        } else if (roleName.equals("CANDIDATE")) {
            // candidate save skill
            if (requestUser.getSkills() != null) {
                List<Long> reqSkills = requestUser.getSkills()
                        .stream().map(skill -> skill.getId())
                        .collect(Collectors.toList());
                List<Skill> dbSkills = this.skillRepository.findByIdIn(reqSkills);
                currentUser.setSkills(dbSkills);
            }
            currentUser.setCompany(null); // clkear data Candidate when up Company
        }
        return UserMapper.convertToResUpdatedUserRes(this.userRepository.save(currentUser));
    }

    @Transactional
    public void deleteUser(Long id) throws Exception {
        String email = SecurityUtils.getCurrentUserLogin().orElse("");
        User loggedUser = this.handleGetUserByUsername(email);
        if (loggedUser == null
                || (!loggedUser.getId().equals(id)) && !loggedUser.getRole().getName().equals("SUPER_ADMIN")) {
            throw new IdInvalidException("You don't have permission to delete this user");
        }

        User user = this.handleGetUserByUsername(this.userRepository.findById(id).get().getEmail());
        if (user.getResumes() != null && !user.getResumes().isEmpty()) {
            throw new IdInvalidException(
                    "Cannot delete user because there are resumes/applications associated with them");
        }
        if (this.userRepository.existsById(id)) {
            this.userRepository.deleteById(id);
        } else {
            throw new IdInvalidException("The specified User ID is invalid");
        }
    }

    public User handleGetUserByUsername(String username) {
        return this.userRepository.findByEmail(username);
    }

    public ResultPaginationResponse getAllUser(Pageable pageable, Specification<User> spec) {
        Page<User> userPage = this.userRepository.findAll(spec, pageable);

        return FormatResultPagination.createPaginateUserRes(userPage);
    }

    @Transactional
    public UpdatedUserResponse updateUser(Long id, UpdateUserDTO requestUser) throws Exception {
        Optional<User> userOptional = this.userRepository.findById(id);
        if (userOptional.isPresent()) {
            User currentUser = userOptional.get();

            // check ownership or admin
            String email = SecurityUtils.getCurrentUserLogin().orElse("");
            User loggedInUser = this.handleGetUserByUsername(email);
            if (loggedInUser == null || (!loggedInUser.getId().equals(currentUser.getId())
                    && !loggedInUser.getRole().getName().equals("SUPER_ADMIN"))) {
                throw new IdInvalidException("You don't have permission to update this user's profile");
            }

            currentUser.setName(requestUser.getName());
            currentUser.setGender(requestUser.getGender());
            currentUser.setAddress(requestUser.getAddress());
            currentUser.setDateOfBirth(requestUser.getDateOfBirth());
            currentUser.setAvatarUrl(requestUser.getAvatarUrl());
            currentUser.setPhone(requestUser.getPhone());

            if (requestUser.getCompany() != null) {
                Company company = this.companyService.findCompanyById(requestUser.getCompany().getId());
                if (company == null) {
                    throw new IdInvalidException("Company Id is invalid");
                }
                currentUser.setCompany(company);
            }
            if (requestUser.getSkills() != null) {
                List<Long> reqSkills = requestUser.getSkills()
                        .stream().map(
                                skill -> skill.getId())
                        .collect(Collectors.toList());
                List<Skill> dbSkills = this.skillRepository.findByIdIn(reqSkills);
                currentUser.setSkills(dbSkills);
            }
            if (requestUser.getRole() != null && loggedInUser.getRole().getName().equals("SUPER_ADMIN")) {
                Role role = this.roleService.fetchRoleById(requestUser.getRole().getId());
                currentUser.setRole(role);
            }
            if (requestUser.getActive() != null && loggedInUser.getRole().getName().equals("SUPER_ADMIN")) {
                if (loggedInUser.getId().equals(currentUser.getId()) && !requestUser.getActive()) {
                    throw new IdInvalidException("You cannot deactivate your own account");
                }
                currentUser.setActive(requestUser.getActive());
                if (!requestUser.getActive()) {
                    currentUser.setRefreshToken(null);
                }
            }

            return UserMapper.convertToResUpdatedUserRes(this.userRepository.save(currentUser));
        }
        throw new IdInvalidException("User ID = " + id + " not found");
    }

    public void updateUserToken(String token, String email) {
        User user = this.handleGetUserByUsername(email);
        if (user != null) {
            user.setRefreshToken(token);
            this.userRepository.save(user);
        }
    }

    public User getUserByRefreshTokenAndEmail(String token, String email) {
        return this.userRepository.findByRefreshTokenAndEmail(token, email);
    }

    public void changePassword(ChangePasswordDTO dto) throws Exception {
        String email = SecurityUtils.getCurrentUserLogin().isPresent() ? SecurityUtils.getCurrentUserLogin().get() : "";
        User user = this.handleGetUserByUsername(email);
        if (user == null)
            throw new IdInvalidException("User not found");

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new IdInvalidException("Current Password is incorrect");
        }
        if (dto.getNewPassword().equals(dto.getCurrentPassword())) {
            throw new IdInvalidException("Mật khẩu mới không được trùng với mật khẩu hiện tại");
        }
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new IdInvalidException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        this.userRepository.save(user);
    }
}

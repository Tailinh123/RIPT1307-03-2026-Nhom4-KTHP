package vn.tailinh.internmatching.service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.controller.RoleController;
import vn.tailinh.internmatching.entity.Permission;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.exception.IdInvalidException;
import vn.tailinh.internmatching.repository.PermissionRepository;
import vn.tailinh.internmatching.repository.RoleRepository;
import vn.tailinh.internmatching.util.response.FormatResultPagination;
import vn.tailinh.internmatching.entity.Role;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {
  private final RoleController roleController;
  private final RoleRepository roleRepository;
  private final PermissionRepository permissionRepository;





  
  public Role create(Role role) throws Exception {
    if (this.roleRepository.existsByName(
        role.getName())) {
      throw new DataIntegrityViolationException("Role already exists");
    }
    if (role.getPermissions() != null) {
      List<Long> reqPermissions = role.getPermissions()
          .stream().map(
              permission -> permission.getId())
          .collect(Collectors.toList());
      List<Permission> dbPermissions = this.permissionRepository.findByIdIn(reqPermissions);
      role.setPermissions(dbPermissions);
    }
    return this.roleRepository.save(role);
  }



  public Role fetchRoleById(Long id) throws Exception {
    Optional<Role> role = this.roleRepository.findById(id);
    if (role.isPresent()) {
      return role.get();
    } else {
      throw new IdInvalidException("The specified Role ID is invalid");
    }
  }




  public Role fetchRoleByName(String name) {
    return this.roleRepository.findByName(name);
  }

  public Role update(Role role) throws Exception {
    Role currentRole = this.fetchRoleById(role.getId());

    if (role.getPermissions() != null) {
      List<Long> reqPermissions = role.getPermissions()
          .stream().map(
              Permission::getId)
          .collect(Collectors.toList());
      List<Permission> dbPermissions = this.permissionRepository.findByIdIn(reqPermissions);
      role.setPermissions(dbPermissions);
    }

    currentRole.setName(role.getName());
    currentRole.setActive(role.isActive());
    currentRole.setDescription(role.getDescription());
    currentRole.setPermissions(role.getPermissions());
    return this.roleRepository.save(currentRole);
  }



  public void delete(Long id ) throws Exception {
    Role role = this.fetchRoleById(id);

    if(role.getUsers() != null && !role.getUsers().isEmpty()) {
      throw new IdInvalidException("Cannot delete this role because there are users associated with it");
    }
    this.roleRepository.delete(role);
  }



  public ResultPaginationResponse fetchAll(Specification<Role> spec, Pageable pageable) {
    Page<Role> rolePage = this.roleRepository.findAll(spec, pageable);
    ResultPaginationResponse response = FormatResultPagination.createPaginationResponse(rolePage);
    return response;
  }
}

package vn.tailinh.internmatching.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tailinh.internmatching.entity.Permission;

import java.util.List;
import java.util.Optional;

@Repository
public interface PermissionRepository extends
        JpaRepository<Permission, Long>, JpaSpecificationExecutor<Permission> {

    boolean existsByModuleAndApiPathAndMethod(String module, String apiPath, String method);

    Optional<Permission> findByModuleAndApiPathAndMethod(String module, String apiPath, String method);

    boolean existsByModuleAndApiPathAndMethodAndIdNot(String module, String apiPath, String method, Long id);

    List<Permission> findByIdIn(List<Long> id);

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);
}

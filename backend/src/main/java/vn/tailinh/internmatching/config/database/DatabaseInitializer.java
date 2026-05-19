package vn.tailinh.internmatching.config.database;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.Permission;
import vn.tailinh.internmatching.entity.Role;
import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.repository.PermissionRepository;
import vn.tailinh.internmatching.repository.RoleRepository;
import vn.tailinh.internmatching.repository.UserRepository;
import vn.tailinh.internmatching.util.constant.Gender;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {
    private final PermissionRepository permissionRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    
    private Permission createPerm(String name, String path, String method, String module) {
        Permission p = new Permission();
        p.setName(name);
        p.setApiPath(path);
        p.setMethod(method);
        p.setModule(module);
        return p;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> START INIT DATABASE");
        long countPermissions = this.permissionRepository.count();
        long countRoles = this.roleRepository.count();
        long countUsers = this.userRepository.count();

        if(countPermissions == 0){
            ArrayList<Permission> arr = new ArrayList<>();

       
            arr.add(createPerm("Create a company", "/api/v1/companies", "POST", "COMPANIES"));
            arr.add(createPerm("Update a company", "/api/v1/companies", "PUT", "COMPANIES"));
            arr.add(createPerm("Delete a company", "/api/v1/companies/{id}", "DELETE", "COMPANIES"));
            arr.add(createPerm("Get a company by id", "/api/v1/companies/{id}", "GET", "COMPANIES"));
            arr.add(createPerm("Get companies with pagination", "/api/v1/companies", "GET", "COMPANIES"));

            arr.add(createPerm("Create a job", "/api/v1/jobs", "POST", "JOBS"));
            arr.add(createPerm("Update a job", "/api/v1/jobs", "PUT", "JOBS"));
            arr.add(createPerm("Delete a job", "/api/v1/jobs/{id}", "DELETE", "JOBS"));
            arr.add(createPerm("Get a job by id", "/api/v1/jobs/{id}", "GET", "JOBS"));
            arr.add(createPerm("Get jobs with pagination", "/api/v1/jobs", "GET", "JOBS"));

            arr.add(createPerm("Create a permission", "/api/v1/permissions", "POST", "PERMISSIONS"));
            arr.add(createPerm("Update a permission", "/api/v1/permissions", "PUT", "PERMISSIONS"));
            arr.add(createPerm("Delete a permission", "/api/v1/permissions/{id}", "DELETE", "PERMISSIONS"));
            arr.add(createPerm("Get a permission by id", "/api/v1/permissions/{id}", "GET", "PERMISSIONS"));
            arr.add(createPerm("Get permissions with pagination", "/api/v1/permissions", "GET", "PERMISSIONS"));

            arr.add(createPerm("Create a resume", "/api/v1/resumes", "POST", "RESUMES"));
            arr.add(createPerm("Update a resume", "/api/v1/resumes", "PUT", "RESUMES"));
            arr.add(createPerm("Delete a resume", "/api/v1/resumes/{id}", "DELETE", "RESUMES"));
            arr.add(createPerm("Get a resume by id", "/api/v1/resumes/{id}", "GET", "RESUMES"));
            arr.add(createPerm("Get resumes with pagination", "/api/v1/resumes", "GET", "RESUMES"));

            arr.add(createPerm("Create a role", "/api/v1/roles", "POST", "ROLES"));
            arr.add(createPerm("Update a role", "/api/v1/roles", "PUT", "ROLES"));
            arr.add(createPerm("Delete a role", "/api/v1/roles/{id}", "DELETE", "ROLES"));
            arr.add(createPerm("Get a role by id", "/api/v1/roles/{id}", "GET", "ROLES"));
            arr.add(createPerm("Get roles with pagination", "/api/v1/roles", "GET", "ROLES"));

            arr.add(createPerm("Create a user", "/api/v1/users", "POST", "USERS"));
            arr.add(createPerm("Update a user", "/api/v1/users", "PUT", "USERS"));
            arr.add(createPerm("Delete a user", "/api/v1/users/{id}", "DELETE", "USERS"));
            arr.add(createPerm("Get a user by id", "/api/v1/users/{id}", "GET", "USERS"));
            arr.add(createPerm("Get users with pagination", "/api/v1/users", "GET", "USERS"));

            arr.add(createPerm("Create a subscriber", "/api/v1/subscribers", "POST", "SUBSCRIBERS"));
            arr.add(createPerm("Update a subscriber", "/api/v1/subscribers", "PUT", "SUBSCRIBERS"));
            arr.add(createPerm("Delete a subscriber", "/api/v1/subscribers/{id}", "DELETE", "SUBSCRIBERS"));
            arr.add(createPerm("Get a subscriber by id", "/api/v1/subscribers/{id}", "GET", "SUBSCRIBERS"));
            arr.add(createPerm("Get subscribers with pagination", "/api/v1/subscribers", "GET", "SUBSCRIBERS"));

            arr.add(createPerm("Download a file", "/api/v1/files", "POST", "FILES"));
            arr.add(createPerm("Upload a file", "/api/v1/files", "GET", "FILES"));

            this.permissionRepository.saveAll(arr);
        }

        if (countRoles == 0) {
            List<Permission> allPermissions = this.permissionRepository.findAll();

            Role adminRole = new Role();
            adminRole.setName("SUPER_ADMIN");
            adminRole.setDescription("Admin thì full permissions");
            adminRole.setActive(true);
            adminRole.setPermissions(allPermissions);

            this.roleRepository.save(adminRole);
        }

        if (countUsers == 0) {
            User adminUser = new User();
            adminUser.setEmail("admin@gmail.com");
            adminUser.setAddress("hn");
            adminUser.setDateOfBirth(LocalDate.of(2000, 1, 1));
            adminUser.setGender(Gender.MALE);
            adminUser.setName("I'm super admin");
            adminUser.setPassword(this.passwordEncoder.encode("123456"));

  
            Role adminRole = this.roleRepository.findByName("SUPER_ADMIN");
            if (adminRole != null) {
                adminUser.setRole(adminRole);
            }

            this.userRepository.save(adminUser);
        }

        if (countPermissions > 0 && countRoles > 0 && countUsers > 0) {
            System.out.println(">>> SKIP INIT DATABASE ~ ALREADY HAVE DATA...");
        } else {
            System.out.println(">>> END INIT DATABASE");
        }
    }
}

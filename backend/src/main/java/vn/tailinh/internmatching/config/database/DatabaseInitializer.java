package vn.tailinh.internmatching.config.database;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.Company;
import vn.tailinh.internmatching.entity.Job;
import vn.tailinh.internmatching.entity.JobCategory;
import vn.tailinh.internmatching.entity.Permission;
import vn.tailinh.internmatching.entity.Role;
import vn.tailinh.internmatching.entity.Skill;
import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.repository.CompanyRepository;
import vn.tailinh.internmatching.repository.JobCategoryRepository;
import vn.tailinh.internmatching.repository.JobRepository;
import vn.tailinh.internmatching.repository.PermissionRepository;
import vn.tailinh.internmatching.repository.RoleRepository;
import vn.tailinh.internmatching.repository.SkillRepository;
import vn.tailinh.internmatching.repository.UserRepository;
import vn.tailinh.internmatching.util.constant.Gender;
import vn.tailinh.internmatching.util.constant.JobType;
import vn.tailinh.internmatching.util.constant.Level;
import vn.tailinh.internmatching.util.constant.WorkMode;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

  private final PermissionRepository permissionRepository;
  private final RoleRepository roleRepository;
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final CompanyRepository companyRepository;
  private final JobCategoryRepository jobCategoryRepository;
  private final SkillRepository skillRepository;
  private final JobRepository jobRepository;

  private Permission createPerm(String name, String path, String method, String module) {
    Permission p = new Permission();
    p.setName(name);
    p.setApiPath(path);
    p.setMethod(method);
    p.setModule(module);
    return p;
  }

  private List<Permission> createCrudPerms(String entity, String path, String module) {
    return List.of(
        createPerm("Create a " + entity, path, "POST", module),
        createPerm("Update a " + entity, path, "PUT", module),
        createPerm("Delete a " + entity, path + "/{id}", "DELETE", module),
        createPerm("Get a " + entity + " by id", path + "/{id}", "GET", module),
        createPerm("Get " + entity + "s with pagination", path, "GET", module));
  }

  @Override
  public void run(String... args) throws Exception {
    System.out.println(">>> START INIT DATABASE");
    long countPermissions = this.permissionRepository.count();
    long countRoles = this.roleRepository.count();
    long countUsers = this.userRepository.count();

    if (countPermissions == 0) {
      ArrayList<Permission> arr = new ArrayList<>();

      arr.addAll(createCrudPerms("application", "/api/v1/applications", "APPLICATIONS"));
      arr.addAll(createCrudPerms("company", "/api/v1/companies", "COMPANIES"));
      arr.addAll(createCrudPerms("job", "/api/v1/jobs", "JOBS"));
      arr.addAll(createCrudPerms("permission", "/api/v1/permissions", "PERMISSIONS"));
      arr.addAll(createCrudPerms("resume", "/api/v1/resumes", "RESUMES"));
      arr.addAll(createCrudPerms("role", "/api/v1/roles", "ROLES"));
      arr.addAll(createCrudPerms("user", "/api/v1/users", "USERS"));
      arr.addAll(createCrudPerms("subscriber", "/api/v1/subscribers", "SUBSCRIBERS"));

      arr.add(createPerm("Upload a file", "/api/v1/files", "POST", "FILES"));
      arr.add(createPerm("DownLoad a file", "/api/v1/files", "GET", "FILES"));

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

      Role userRole = new Role();
      userRole.setName("CANDIDATE");
      userRole.setDescription("Default user role for candidates");
      userRole.setActive(true);
      
      List<Permission> candidatePerms = allPermissions.stream()
          .filter(p -> {
              String mod = p.getModule();
              String method = p.getMethod();
              if (mod.equals("COMPANIES") && method.equals("GET")) return true;
              if (mod.equals("JOBS") && method.equals("GET")) return true;
              if (mod.equals("FILES")) return true;
              if (mod.equals("RESUMES")) return true;
              if (mod.equals("APPLICATIONS") && (method.equals("POST") || method.equals("GET"))) return true;
              if (mod.equals("USERS") && (method.equals("PUT") || method.equals("GET"))) return true;
              return false;
          })
          .toList();
      userRole.setPermissions(candidatePerms); 
      this.roleRepository.save(userRole);

      Role hrRole = new Role();
      hrRole.setName("HR_MANAGER");
      hrRole.setDescription("HR role for company recruiters");
      hrRole.setActive(true);
      
      List<Permission> hrPermissions = allPermissions.stream()
          .filter(p -> {
              String mod = p.getModule();
              String method = p.getMethod();
              if (mod.equals("JOBS") || mod.equals("APPLICATIONS") || mod.equals("COMPANIES") || mod.equals("FILES")) return true;
              if (mod.equals("RESUMES") && method.equals("GET")) return true;
              if (mod.equals("USERS") && (method.equals("PUT") || method.equals("GET"))) return true;
              return false;
          })
          .toList();
      hrRole.setPermissions(hrPermissions);
      this.roleRepository.save(hrRole);
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
      
      List<Permission> allPermissions = this.permissionRepository.findAll();
      
      Role userRole = this.roleRepository.findByName("CANDIDATE");
      if (userRole != null) {
          List<Permission> candidatePerms = allPermissions.stream()
              .filter(p -> {
                  String mod = p.getModule();
                  String method = p.getMethod();
                  if (mod.equals("COMPANIES") && method.equals("GET")) return true;
                  if (mod.equals("JOBS") && method.equals("GET")) return true;
                  if (mod.equals("FILES")) return true;
                  if (mod.equals("RESUMES")) return true;
                  if (mod.equals("APPLICATIONS") && (method.equals("POST") || method.equals("GET"))) return true;
                  if (mod.equals("USERS") && (method.equals("PUT") || method.equals("GET"))) return true;
                  return false;
              })
              .toList();
          userRole.setPermissions(candidatePerms);
          this.roleRepository.save(userRole);
      }
      
      Role hrRole = this.roleRepository.findByName("HR_MANAGER");
      if (hrRole != null) {
          List<Permission> hrPermissions = allPermissions.stream()
              .filter(p -> {
                  String mod = p.getModule();
                  String method = p.getMethod();
                  if (mod.equals("JOBS") || mod.equals("APPLICATIONS") || mod.equals("COMPANIES") || mod.equals("FILES")) return true;
                  if (mod.equals("RESUMES") && method.equals("GET")) return true;
                  if (mod.equals("USERS") && (method.equals("PUT") || method.equals("GET"))) return true;
                  return false;
              })
              .toList();
          hrRole.setPermissions(hrPermissions);
          this.roleRepository.save(hrRole);
      }
    } else {
      System.out.println(">>> END INIT DATABASE");
    }
  }
}

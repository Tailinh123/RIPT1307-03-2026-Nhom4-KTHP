package vn.tailinh.internmatching.service;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.dto.request.application.UpdateApplicationDTO;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.dto.response.application.CreateApplicationResponse;
import vn.tailinh.internmatching.dto.response.application.UpdateApplicationResponse;
import vn.tailinh.internmatching.entity.Application;
import vn.tailinh.internmatching.entity.Job;
import vn.tailinh.internmatching.entity.Resume;
import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.exception.IdInvalidException;
import vn.tailinh.internmatching.repository.ApplicationRepository;
import vn.tailinh.internmatching.repository.JobRepository;
import vn.tailinh.internmatching.repository.ResumeRepository;
import vn.tailinh.internmatching.repository.UserRepository;
import vn.tailinh.internmatching.security.SecurityUtils;
import vn.tailinh.internmatching.util.mapper.ApplicationMapper;
import vn.tailinh.internmatching.util.response.FormatResultPagination;

@Service
@RequiredArgsConstructor
public class ApplicationService {

  private final ApplicationRepository applicationRepository;
  private final JobRepository jobRepository;
  private final ResumeRepository resumeRepository;
  private final UserRepository userRepository;
  private final EmailService emailService;

  public CreateApplicationResponse create(Application application) throws Exception {

    String email = SecurityUtils.getCurrentUserLogin().orElse("");
    User currentUser = this.userRepository.findByEmail(email);
    if(currentUser == null ) {
      throw new IdInvalidException("User not found or not logged in");
    }

    // check job 
    Optional<Job> jobOptional = this.jobRepository.findById(application.getJob().getId());
    if (jobOptional.isEmpty()) {
      throw new IdInvalidException("Job not found");
    }

    // check job active 
    Job dbJob = jobOptional.get();
    if(!dbJob.isActive()) {
      throw new IdInvalidException("Job is not longer active");
    }

    // check endDate
    if(dbJob.getEndDate() != null && dbJob.getEndDate().isBefore(java.time.Instant.now())) {
      throw new IdInvalidException("This job has expired ");
    }

    // check resume 
    Optional<Resume> resumeOptional = this.resumeRepository.findById(application.getResume().getId());
    if (resumeOptional.isEmpty()) {
      throw new IdInvalidException("Resume not found");
    }
    Resume dbResume = resumeOptional.get();

    if(dbResume.getUser() == null || !dbResume.getUser().getId().equals(currentUser.getId())) {
      throw new  IdInvalidException("You don't have permission to use this resume");
    }

    if (this.applicationRepository.existsByJobIdAndResumeUserId(application.getJob().getId(), currentUser.getId())) {
      throw new IdInvalidException("You have already applied to this job");
    }

    application = this.applicationRepository.save(application);
    return ApplicationMapper.toCreateApplicationResponse(application);
  }



  public UpdateApplicationResponse update(UpdateApplicationDTO dto) throws Exception {
    Optional<Application> appOptional = this.applicationRepository.findById(dto.getId());

    if (appOptional.isEmpty()) {
      throw new IdInvalidException("Application not found");
    }
    Application currentApp = appOptional.get();
    
    // check ownership hr
    String email = SecurityUtils.getCurrentUserLogin().orElse("");
    User currentUser = this.userRepository.findByEmail(email);
    if(currentUser == null) {
      throw new IdInvalidException("User not found or logged in");
    }

    // get job from application -> get company 
    Job applicationJob= currentApp.getJob();
    if(applicationJob == null || applicationJob.getCompany() == null ) {
      throw new IdInvalidException("Application has no associated job/company");
    }

    // logic equals
    if(currentUser.getCompany() == null || !currentUser.getCompany().getId().equals(applicationJob.getCompany().getId())){
      throw new IdInvalidException("You don't have permission to update this application");
    }

    currentApp.setStatus(dto.getStatus());
    currentApp.setNote(dto.getNote());
    currentApp = this.applicationRepository.save(currentApp);

      try {
        // get info student from resume -> user
        User student = currentApp.getResume().getUser();
      if (student != null && student.getEmail() != null) {
            String studentEmail = student.getEmail();
            String studentName = student.getName();
           
           // get job
           String jobName = applicationJob.getName();
            String companyName = applicationJob.getCompany().getName();
          
           // Create subject ( status)
          String subject = switch (dto.getStatus()) {
                case APPROVED -> " Chúc mừng! Đơn ứng tuyển " + jobName + " đã được duyệt";
              case REJECTED -> " Thông báo kết quả ứng tuyển " + jobName;
              case REVIEWING -> " Đơn ứng tuyển " + jobName + " đang được xem xét";
                default -> "Cập nhật trạng thái ứng tuyển " + jobName;
            };
            
           //  email async (not block response)
           this.emailService.sendApplicationNotification(
              studentEmail,
                subject,
                "application-notification",
                studentName,
                jobName,
               companyName,
             dto.getStatus().name(),
                dto.getNote()
            );
        }
    } catch (Exception e) {

        System.out.println("WARNING: Failed to send email notification: " + e.getMessage());
   }


    return ApplicationMapper.toUpdateApplicationResponse(currentApp);

  }



  public ResultPaginationResponse fetchAllApplication(
      Specification<Application> specification, Pageable pageable) {
    Page<Application> page = this.applicationRepository.findAll(specification, pageable);
    return FormatResultPagination.createPaginationResponse(page);
  }



  public void deleteApplication(Long id) throws Exception {
    Optional<Application> applicationOptional = this.applicationRepository.findById(id);
    if(applicationOptional.isEmpty()) {
      throw new IdInvalidException("Application not found ");
    }
    Application currentApplication = applicationOptional.get();

    // get user login 
    String email = SecurityUtils.getCurrentUserLogin().orElse("");
    User currentUser = this.userRepository.findByEmail(email);
    if(currentUser == null ) {
      throw new IdInvalidException("User not found or logged in");
    }

    // currentUser is candidate
    Resume applicationResume = currentApplication.getResume();
    if(applicationResume != null && applicationResume.getUser() != null) {
      if(currentUser.getId().equals(applicationResume.getUser().getId())) {
        this.applicationRepository.deleteById(id);
        return;
      }
    }

    // currentUser is HR
    Job applicationJob = currentApplication.getJob();
    if(applicationJob != null && applicationJob.getCompany() != null ) {
    if(currentUser.getCompany() != null && currentUser.getCompany().getId().equals(applicationJob.getCompany().getId())) {
      this.applicationRepository.deleteById(id);
      return;
}
    }
    throw new IdInvalidException("You don't have a permission to delete this application");
  }

  
  
  public ResultPaginationResponse fetchByUser(Pageable pageable) {
      String email = SecurityUtils.getCurrentUserLogin().orElse("");
      User user = this.userRepository.findByEmail(email);
      if(user == null) {
        return FormatResultPagination.createPaginationResponse(Page.empty());
      }

      Page<Application> page = this.applicationRepository.findByResumeUserId(user.getId() , pageable);
      return FormatResultPagination.createPaginationResponse(page);
    }
}

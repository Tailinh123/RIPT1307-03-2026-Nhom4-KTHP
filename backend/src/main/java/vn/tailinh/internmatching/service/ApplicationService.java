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

  public CreateApplicationResponse create(Application application) throws Exception {

    // check job 
    Optional<Job> jobOptional = this.jobRepository.findById(application.getJob().getId());
    if (jobOptional.isEmpty()) {
      throw new IdInvalidException("Job not found");
    }

    // check resume 
    Optional<Resume> resumeOptional = this.resumeRepository.findById(application.getResume().getId());
    if (resumeOptional.isEmpty()) {
      throw new IdInvalidException("Resume not found");
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
    currentApp.setStatus(dto.getStatus());
    currentApp.setNote(dto.getNote());
    currentApp = this.applicationRepository.save(currentApp);
    return ApplicationMapper.toUpdateApplicationResponse(currentApp);

  }

  public ResultPaginationResponse fetchAllApplication(
      Specification<Application> specification, Pageable pageable) {
    Page<Application> page = this.applicationRepository.findAll(specification, pageable);
    return FormatResultPagination.createPaginationResponse(page);
  }

  public void deleteApplication(Long id) throws Exception {
    if (!this.applicationRepository.existsById(id)) {
      throw new IdInvalidException("Application not found");
    }

    this.applicationRepository.deleteById(id);
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

package vn.tailinh.internmatching.service;

import java.util.Optional;

import org.springframework.boot.autoconfigure.batch.BatchProperties.Job;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.dto.request.application.CreateApplicationDTO;
import vn.tailinh.internmatching.dto.response.application.CreateApplicationResponse;
import vn.tailinh.internmatching.entity.Application;
import vn.tailinh.internmatching.entity.Resume;
import vn.tailinh.internmatching.exception.IdInvalidException;
import vn.tailinh.internmatching.repository.ApplicationRepository;
import vn.tailinh.internmatching.repository.JobCategoryRepository;
import vn.tailinh.internmatching.repository.JobRepository;
import vn.tailinh.internmatching.repository.ResumeRepository;
import vn.tailinh.internmatching.repository.UserRepository;
import vn.tailinh.internmatching.util.constant.ApplicationStatus;
import vn.tailinh.internmatching.util.mapper.ApplicationMapper;


@Service 
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;


    public CreateApplicationResponse create(CreateApplicationDTO dto) throws Exception {

      // check job tồn tại 
      Optional<Job> jobOptional = this.jobRepository.findById(dto.getJob().getId());
      if (jobOptional.isEmpty()) {
        throw new IdInvalidException("Job not found");
      }

      // check reusume tồn tại 
      Optional<Resume> resumeOptional = this.resumeRepository.findById(dto.getResume().getId());
      if(resumeOptional.isEmpty()) {
        throw new IdInvalidException("Resume not found");
      }

       Application app = new Application();
        app.setJob(jobOptional.get());
        app.setResume(resumeOptional.get());
        app.setStatus(ApplicationStatus.PENDING);
        app.setNote(dto.getNote());

        return ApplicationMapper.toCreateApplicationResponse(
            this.applicationRepository.save(app));
    
    }


}
  


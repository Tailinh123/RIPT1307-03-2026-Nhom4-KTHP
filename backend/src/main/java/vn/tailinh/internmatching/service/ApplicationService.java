package vn.tailinh.internmatching.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.dto.response.application.CreateApplicationResponse;
import vn.tailinh.internmatching.entity.Application;
import vn.tailinh.internmatching.entity.Job;
import vn.tailinh.internmatching.entity.Resume;
import vn.tailinh.internmatching.exception.IdInvalidException;
import vn.tailinh.internmatching.repository.ApplicationRepository;
import vn.tailinh.internmatching.repository.JobRepository;
import vn.tailinh.internmatching.repository.ResumeRepository;
import vn.tailinh.internmatching.util.mapper.ApplicationMapper;


@Service 
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final ResumeRepository resumeRepository;


    public CreateApplicationResponse create(Application application) throws Exception {

      // check job tồn tại 
      Optional<Job> jobOptional = this.jobRepository.findById(application.getJob().getId());
      if (jobOptional.isEmpty()) {
        throw new IdInvalidException("Job not found");
      }

      // check resume tồn tại 
      Optional<Resume> resumeOptional = this.resumeRepository.findById(application.getResume().getId());
      if(resumeOptional.isEmpty()) {
        throw new IdInvalidException("Resume not found");
      }

      application = this.applicationRepository.save(application);



        return ApplicationMapper.toCreateApplicationResponse(application);
    
    }


    // public UpdateApplicationResponse update(UpdateApplicationDTO dto ) throws Exception {

      
    // }


}
  


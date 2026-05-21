package vn.tailinh.internmatching.service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.Job;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.dto.response.job.ResponseCreateJobDTO;
import vn.tailinh.internmatching.dto.response.job.UpdatedJobResponse;
import vn.tailinh.internmatching.exception.IdInvalidException;
import vn.tailinh.internmatching.repository.CompanyRepository;
import vn.tailinh.internmatching.repository.JobRepository;
import vn.tailinh.internmatching.repository.SkillRepository;
import vn.tailinh.internmatching.util.mapper.JobMapper;
import vn.tailinh.internmatching.util.response.FormatResultPagination;
import vn.tailinh.internmatching.entity.Company;
import vn.tailinh.internmatching.entity.Skill;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {
    private final JobRepository jobRepository;
    private final SkillRepository skillRepository;
    private final CompanyRepository companyRepository;

    public ResponseCreateJobDTO create(Job job){
        if(job.getSkills() != null){
            List<Long> reqSkills = job.getSkills()
                    .stream().map(Skill::getId)
                    .collect(Collectors.toList());
            List<Skill> dbSkills = this.skillRepository.findByIdIn(reqSkills);
            job.setSkills(dbSkills);
        }

        if(job.getCompany() != null){
            Optional<Company> companyOptional = this.companyRepository.findById(job.getCompany().getId());
            companyOptional.ifPresent(job::setCompany);
        }

        Job currentJob = this.jobRepository.save(job);
        return JobMapper.toCreatedJobResponse(currentJob);
    }

    public UpdatedJobResponse update(Job job) throws Exception{
        if(job.getId() == null){
            throw new IdInvalidException("Job ID not found");
        }
        Job jobInDB = this.fetchJobById(job.getId());

        if(job.getSkills() != null){
            List<Long> reqSkills = job.getSkills()
                    .stream().map(Skill::getId)
                    .collect(Collectors.toList());
            List<Skill> dbSkills = this.skillRepository.findByIdIn(reqSkills);
            jobInDB.setSkills(dbSkills);
        }

        if(job.getCompany() != null){
            Optional<Company> companyOptional = this.companyRepository.findById(job.getCompany().getId());
            companyOptional.ifPresent(jobInDB::setCompany);
        }

        Job currentJob = this.jobRepository.save(jobInDB);
        return JobMapper.toUpdatedJobResponse(currentJob);
    }

    public void delete(Long id) throws Exception{
        if(!this.jobRepository.existsById(id)){
            throw new IdInvalidException("Job not found");
        }
        this.jobRepository.deleteById(id);
    }

    public Job fetchJobById(Long id) throws Exception{
        Optional<Job> currentJob = this.jobRepository.findById(id);
        if(!currentJob.isPresent()){
            throw new IdInvalidException("Job not found");
        }
        return currentJob.get();
    }

    public ResultPaginationResponse fetchAllJob(Specification<Job> spec, Pageable pageable){
        Page<Job> jobPage = this.jobRepository.findAll(spec, pageable);
        ResultPaginationResponse response = FormatResultPagination.createPaginationResponse(jobPage);
        return response;
    }
}

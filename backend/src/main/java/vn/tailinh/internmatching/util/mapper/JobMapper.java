package vn.tailinh.internmatching.util.mapper;

import java.util.List;
import java.util.stream.Collectors;

import vn.tailinh.internmatching.entity.Job;
import vn.tailinh.internmatching.dto.response.job.CreateJobDTOResponse;
import vn.tailinh.internmatching.dto.response.job.FetchJobResponse;
import vn.tailinh.internmatching.dto.response.job.UpdatedJobResponse;
import vn.tailinh.internmatching.entity.Skill;

public class JobMapper {
  private JobMapper(){}
  public static CreateJobDTOResponse toCreatedJobResponse(Job job) {
    CreateJobDTOResponse res = new CreateJobDTOResponse();
    res.setId(job.getId());
    res.setName(job.getName());
    res.setSalary(job.getSalary());
    res.setQuantity(job.getQuantity());
    res.setLocation(job.getLocation());
    res.setStartDate(job.getStartDate());
    res.setEndDate(job.getEndDate());
    res.setActive(job.isActive());
    res.setLevel(job.getLevel());
    res.setWorkMode(job.getWorkMode());
    res.setJobType(job.getJobType());

    res.setCreatedAt(job.getCreatedAt());
    res.setCreatedBy(job.getCreatedBy());

    
    // company

    if (job.getCompany() != null) {
      CreateJobDTOResponse.CompanyDTO company = new CreateJobDTOResponse.CompanyDTO();
      company.setId(job.getCompany().getId());
      company.setName(job.getCompany().getName());
      res.setCompany(company);
    }

    // category
   
    if (job.getJobCategory() != null) {
      CreateJobDTOResponse.CategoryDTO category = new CreateJobDTOResponse.CategoryDTO();
      category.setId(job.getJobCategory().getId());
      category.setName(job.getJobCategory().getName());
      res.setCategory(category);
    }


    // skill
    if (job.getSkills() != null) {
      List<String> skills = job.getSkills()
          .stream().map(Skill::getName)
          .collect(Collectors.toList());
      res.setSkills(skills);
    }
    return res;
  }

  public static UpdatedJobResponse toUpdatedJobResponse(Job job) {
    UpdatedJobResponse res = new UpdatedJobResponse();

    res.setId(job.getId());
    res.setName(job.getName());
    res.setSalary(job.getSalary());
    res.setQuantity(job.getQuantity());
    res.setLocation(job.getLocation());
    res.setStartDate(job.getStartDate());
    res.setEndDate(job.getEndDate());
    res.setActive(job.isActive());
    res.setLevel(job.getLevel());
    res.setDescription(job.getDescription());
    res.setJobType(job.getJobType());
    res.setWorkMode(job.getWorkMode());

    res.setUpdatedAt(job.getUpdatedAt());
    res.setUpdatedBy(job.getUpdatedBy());
  
    if (job.getSkills() != null) {
      List<String> skills = job.getSkills()
          .stream().map(Skill::getName)
          .collect(Collectors.toList());
      res.setSkills(skills);
    }
    return res;
  }

  public static FetchJobResponse toFetchJobResponse(Job job) {
    FetchJobResponse res = new FetchJobResponse();
    res.setId(job.getId());
    res.setName(job.getName());
    res.setDescription(job.getDescription());
    res.setLocation(job.getLocation());
    res.setQuantity(job.getQuantity());
    res.setSalary(job.getSalary());
    res.setJobType(job.getJobType());
    res.setWorkMode(job.getWorkMode());
    res.setLevel(job.getLevel());
    res.setActive(job.isActive());
    res.setStartDate(job.getStartDate());
    res.setEndDate(job.getEndDate());
    res.setCreatedAt(job.getCreatedAt());
    res.setUpdatedAt(job.getUpdatedAt());
    
    if (job.getCompany() != null) {
        res.setCompany(new FetchJobResponse.CompanyInfo(
            job.getCompany().getId(),
            job.getCompany().getName(),
            job.getCompany().getLogoUrl()
        ));
        res.setCompanyName(job.getCompany().getName());
    }
    if (job.getJobCategory() != null) {
        res.setJobCategory(new FetchJobResponse.CategoryInfo(
            job.getJobCategory().getId(),
            job.getJobCategory().getName()
        ));
    }
    if (job.getSkills() != null) {
        res.setSkills(job.getSkills().stream()
            .map(s -> new FetchJobResponse.SkillInfo(s.getId(), s.getName()))
            .toList());
    }
    return res;
}

}

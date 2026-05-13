package vn.tailinh.internmatching.util.mapper;

import java.util.List;
import java.util.stream.Collectors;

import vn.tailinh.internmatching.entity.Job;
import vn.tailinh.internmatching.dto.response.job.ResponseCreateJobDTO;
import vn.tailinh.internmatching.dto.response.job.UpdatedJobResponse;
import vn.tailinh.internmatching.entity.Skill;

public class JobMapper {
  private JobMapper(){}
  public static ResponseCreateJobDTO toCreatedJobResponse(Job job) {
    ResponseCreateJobDTO res = new ResponseCreateJobDTO();
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
      ResponseCreateJobDTO.CompanyDTO company = new ResponseCreateJobDTO.CompanyDTO();
      company.setId(job.getCompany().getId());
      company.setName(job.getCompany().getName());
      res.setCompany(company);
    }

    // category

   
    if (job.getJobCategory() != null) {
      ResponseCreateJobDTO.CategoryDTO category = new ResponseCreateJobDTO.CategoryDTO();
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
}

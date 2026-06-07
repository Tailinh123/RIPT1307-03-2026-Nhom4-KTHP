package vn.tailinh.internmatching.util.mapper;

import java.util.Collections;
import java.util.stream.Collectors;

import vn.tailinh.internmatching.dto.response.application.CreateApplicationResponse;
import vn.tailinh.internmatching.dto.response.application.FetchApplicationResponse;
import vn.tailinh.internmatching.dto.response.application.UpdateApplicationResponse;
import vn.tailinh.internmatching.entity.Application;

public class ApplicationMapper {
  public static CreateApplicationResponse toCreateApplicationResponse(Application application) {
    CreateApplicationResponse res = new CreateApplicationResponse();

    res.setId(application.getId());
    res.setStatus(application.getStatus());
    res.setNote(application.getNote());
    res.setCreatedAt(application.getCreatedAt());
    res.setCreatedBy(application.getCreatedBy());

    if (application.getResume() != null) {
      CreateApplicationResponse.ResumeDTO resume = new CreateApplicationResponse.ResumeDTO();
      resume.setId(application.getResume().getId());
      resume.setUrl(application.getResume().getUrl());
      res.setResume(resume);
    }

    if (application.getJob() != null) {
      CreateApplicationResponse.JobDTO job = new CreateApplicationResponse.JobDTO();
      job.setId(application.getJob().getId());
      job.setName(application.getJob().getName());
      res.setJob(job);
    }
    return res;
  }

  public static FetchApplicationResponse toFetchApplicationResponse(Application application) {
    FetchApplicationResponse res = new FetchApplicationResponse();
    res.setId(application.getId());
    res.setStatus(application.getStatus());
    res.setNote(application.getNote());
    res.setCreatedAt(application.getCreatedAt());
    res.setCreatedBy(application.getCreatedBy());
    res.setUpdatedAt(application.getUpdatedAt());
    res.setUpdatedBy(application.getUpdatedBy());

    if (application.getResume() != null && application.getResume().getUser() != null) {
      res.setApplicantName(application.getResume().getUser().getName());
      res.setApplicantEmail(application.getResume().getUser().getEmail());
    }

    if (application.getJob() != null) {
      res.setJobName(application.getJob().getName());
      res.setJobTitle(application.getJob().getName());
    }

    if (application.getJob() != null) {
      FetchApplicationResponse.JobDTO job = new FetchApplicationResponse.JobDTO();
      job.setId(application.getJob().getId());
      job.setName(application.getJob().getName());
      job.setLocation(application.getJob().getLocation());
      job.setLevel(application.getJob().getLevel() != null ? application.getJob().getLevel().name() : null);
      job.setWorkMode(application.getJob().getWorkMode() != null ? application.getJob().getWorkMode().name() : null);

      if (application.getJob().getCompany() != null) {
        FetchApplicationResponse.CompanyDTO company = new FetchApplicationResponse.CompanyDTO();
        company.setId(application.getJob().getCompany().getId());
        company.setName(application.getJob().getCompany().getName());
        company.setLogoUrl(application.getJob().getCompany().getLogoUrl());
        job.setCompany(company);
      }
      res.setJob(job);
    }

    if (application.getResume() != null) {
      FetchApplicationResponse.ResumeDTO resume = new FetchApplicationResponse.ResumeDTO();
      resume.setId(application.getResume().getId());
      resume.setTitle(application.getResume().getTitle());
      resume.setUrl(application.getResume().getUrl());

      if (application.getResume().getUser() != null) {
        FetchApplicationResponse.UserDTO user = new FetchApplicationResponse.UserDTO();
        user.setId(application.getResume().getUser().getId());
        user.setName(application.getResume().getUser().getName());
        user.setEmail(application.getResume().getUser().getEmail());
        user.setPhone(application.getResume().getUser().getPhone());
        user.setDateOfBirth(application.getResume().getUser().getDateOfBirth());
        user.setGender(application.getResume().getUser().getGender());
        user.setAddress(application.getResume().getUser().getAddress());
        user.setAvatarUrl(application.getResume().getUser().getAvatarUrl());

        if (application.getResume().getUser().getSkills() != null) {
          user.setSkills(application.getResume().getUser().getSkills().stream()
              .map(s -> new FetchApplicationResponse.SkillDTO(s.getId(), s.getName()))
              .collect(Collectors.toList()));
        } else {
          user.setSkills(Collections.emptyList());
        }

        resume.setUser(user);
      }
      res.setResume(resume);
    }
    return res;
  }

  public static UpdateApplicationResponse toUpdateApplicationResponse(Application application) {
    UpdateApplicationResponse response = new UpdateApplicationResponse();
    response.setId(application.getId());
    response.setNote(application.getNote());
    response.setStatus(application.getStatus().name());
    response.setUpdatedAt(application.getUpdatedAt());
    response.setUpdatedBy(application.getUpdatedBy());
    return response;
  }
}

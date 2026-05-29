package vn.tailinh.internmatching.util.mapper;


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

    // resume
    if (application.getResume() != null) {
      CreateApplicationResponse.ResumeDTO resume = new CreateApplicationResponse.ResumeDTO();
      resume.setId(application.getResume().getId());
      resume.setUrl(application.getResume().getUrl());
      res.setResume(resume);
    }

    // Job

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

    // job
    if (application.getJob() != null) {
      FetchApplicationResponse.JobDTO job = new FetchApplicationResponse.JobDTO();
      job.setId(application.getJob().getId());

      res.setJob(job);
    }

    // resume
    if (application.getResume() != null) {
      FetchApplicationResponse.ResumeDTO resume = new FetchApplicationResponse.ResumeDTO();
      resume.setId(application.getResume().getId());
      resume.setTitle(application.getResume().getTitle());
      resume.setUrl(application.getResume().getUrl());
      res.setResume(resume);
    }
    return res;
  }

  public static UpdateApplicationResponse toUpdateApplicationResponse(Application application) {

    UpdateApplicationResponse response = new UpdateApplicationResponse();

    response.setId(application.getId());
    response.setNote(application.getNote());
    response.setStatus(application.getNote());
    response.setUpdatedAt(application.getUpdatedAt());
    response.setUpdatedBy(application.getUpdatedBy());

    return response;
}

}

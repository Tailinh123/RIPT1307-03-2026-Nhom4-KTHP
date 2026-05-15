package vn.tailinh.internmatching.util.mapper;

import vn.tailinh.internmatching.entity.Resume;
import vn.tailinh.internmatching.dto.response.resume.CreatedResumeResponse;
import vn.tailinh.internmatching.dto.response.resume.FetchResumeResponse;
import vn.tailinh.internmatching.dto.response.resume.UpdatedResumeResponse;

public class ResumeMapper {
    public static CreatedResumeResponse convertToResCreatedResumeRes(Resume resume){
        CreatedResumeResponse res = new CreatedResumeResponse();

        res.setId(resume.getId());
        res.setCreatedAt(resume.getCreatedAt());
        res.setCreatedBy(resume.getCreatedBy());

        return res;
    }

    public static UpdatedResumeResponse convertToResUpdatedResumeRes(Resume resume){
        UpdatedResumeResponse res = new UpdatedResumeResponse();

        res.setUpdatedBy(resume.getUpdatedBy());
        res.setUpdatedAt(resume.getUpdatedAt());

        return res;
    }

    public static FetchResumeResponse convertToResFetchResumeRes(Resume resume){
        FetchResumeResponse res = new FetchResumeResponse();
        res.setId(resume.getId());
        res.setTitle(resume.getTitle());
        res.setUrl(resume.getUrl());
        res.setCreatedAt(resume.getCreatedAt());
        res.setCreatedBy(resume.getCreatedBy());
        res.setUpdatedAt(resume.getUpdatedAt());
        res.setUpdatedBy(resume.getUpdatedBy());


        // Create User In Response
        FetchResumeResponse.UserResume user = new FetchResumeResponse.UserResume();
        user.setId(resume.getUser().getId());
        user.setName(resume.getUser().getName());

        
        // Set User In Response
        res.setUser(user);
        return res;
    }
}

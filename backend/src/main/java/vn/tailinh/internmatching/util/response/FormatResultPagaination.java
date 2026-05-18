package vn.tailinh.internmatching.util.response;

import org.springframework.data.domain.Page;

import vn.tailinh.internmatching.entity.Resume;
import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.dto.response.MetaResponse;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.dto.response.resume.FetchResumeResponse;
import vn.tailinh.internmatching.dto.response.user.CreatedUserResponse;

import vn.tailinh.internmatching.util.mapper.ResumeMapper;
import vn.tailinh.internmatching.util.mapper.UserMapper;

import java.util.List;
import java.util.stream.Collectors;

public class FormatResultPagaination {
    public static ResultPaginationResponse createPaginationResponse(Page page) {
        ResultPaginationResponse rs = new ResultPaginationResponse();
        MetaResponse mr = new MetaResponse();

        mr.setPage(page.getNumber() + 1);
        mr.setPageSize(page.getSize());
        mr.setPages(page.getTotalPages());
        mr.setTotal(page.getTotalElements());

        rs.setMeta(mr);
        rs.setResult(page.getContent());

        return rs;
    }

    public static ResultPaginationResponse createPaginateUserRes(Page<User> page) {
        ResultPaginationResponse rs = new ResultPaginationResponse();
        MetaResponse mr = new MetaResponse();

        mr.setPage(page.getNumber() + 1);
        mr.setPageSize(page.getSize());
        mr.setPages(page.getTotalPages());
        mr.setTotal(page.getTotalElements());

        rs.setMeta(mr);

        List<CreatedUserResponse> listUser = page.getContent()
                .stream().map(UserMapper::convertToResCreatedUserRes)
                .collect(Collectors.toList());

        rs.setResult(listUser);

        return rs;
    }

    public static ResultPaginationResponse createPaginateResumeRes(Page<Resume> page) {
        ResultPaginationResponse rs = new ResultPaginationResponse();
        MetaResponse mr = new MetaResponse();

        mr.setPage(page.getNumber() + 1);
        mr.setPageSize(page.getSize());
        mr.setPages(page.getTotalPages());
        mr.setTotal(page.getTotalElements());

        rs.setMeta(mr);

        List<FetchResumeResponse> listResume = page.getContent()
                .stream().map(
                        ResumeMapper::convertToResFetchResumeRes
                ).toList();

        rs.setResult(listResume);

        return rs;
    }
}

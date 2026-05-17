package vn.tailinh.internmatching.service;

import com.turkraft.springfilter.converter.FilterSpecification;
import com.turkraft.springfilter.converter.FilterSpecificationConverter;
import com.turkraft.springfilter.parser.FilterParser;
import com.turkraft.springfilter.parser.node.FilterNode;
import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.Resume;
import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.dto.response.resume.CreatedResumeResponse;
import vn.tailinh.internmatching.dto.response.resume.UpdatedResumeResponse;
import vn.tailinh.internmatching.exception.IdInvalidException;
import vn.tailinh.internmatching.repository.JobRepository;
import vn.tailinh.internmatching.repository.ResumeRepository;
import vn.tailinh.internmatching.repository.UserRepository;
import vn.tailinh.internmatching.security.SecurityUtils;
import vn.tailinh.internmatching.util.mapper.ResumeMapper;
import vn.tailinh.internmatching.util.response.FormatResultPagaination;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class ResumeService {
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;

    public CreatedResumeResponse create(Resume resume) throws Exception{
        if(!this.checkResumeExistByUserAndJob(resume)){
            throw new DataIntegrityViolationException("Job or User do not exist");
        }
        return ResumeMapper.convertToResCreatedResumeRes(this.resumeRepository.save(resume));
    }

    public Resume fetchResumelById(Long id) throws Exception {
        if(this.resumeRepository.existsById(id)){
            return this.resumeRepository.findById(id).get();
        }else{
            throw new IdInvalidException("The specified Resume ID is invalid");
        }
    }

    public UpdatedResumeResponse update(Resume resume) throws Exception{
        Resume currentResume = this.fetchResumelById(resume.getId());
        return ResumeMapper.convertToResUpdatedResumeRes(this.resumeRepository.save(currentResume));
    }

    public void delete(Long id) throws Exception {
        Resume currentResume = this.fetchResumelById(id);
        if(currentResume == null){
            throw new IdInvalidException("Resume ID is not found");
        }
        this.resumeRepository.deleteById(currentResume.getId());
    }

    public ResultPaginationResponse fetchAllResume(Specification<Resume> spec, Pageable pageable){
        Page<Resume> resumePage = this.resumeRepository.findAll(spec, pageable);
        ResultPaginationResponse response = FormatResultPagaination.createPaginateResumeRes(resumePage);
        return response;
    }

    public ResultPaginationResponse fetchResumeByUser(Pageable pageable){
        String email = SecurityUtils.getCurrentUserLogin().isPresent()
                ? SecurityUtils.getCurrentUserLogin().get()
                : "";
        FilterNode node = filterParser.parse("email='" + email + "'");
        FilterSpecification<Resume> spec = filterSpecificationConverter.convert(node);

        Page<Resume> resumePage = this.resumeRepository.findAll(spec, pageable);
        return FormatResultPagaination.createPaginateResumeRes(resumePage);
    }

    private boolean checkResumeExistByUserAndJob(Resume resume){
        if(resume.getUser() == null){
            return false;
        }
        Optional<User> user = this.userRepository.findById(resume.getUser().getId());
        if(user.isEmpty()){
            return false;
        }
        return true;
    }
}

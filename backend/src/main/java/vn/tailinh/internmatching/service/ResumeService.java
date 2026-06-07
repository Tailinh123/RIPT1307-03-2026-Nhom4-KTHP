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
import vn.tailinh.internmatching.repository.ResumeRepository;
import vn.tailinh.internmatching.repository.UserRepository;
import vn.tailinh.internmatching.security.SecurityUtils;
import vn.tailinh.internmatching.util.mapper.ResumeMapper;
import vn.tailinh.internmatching.util.response.FormatResultPagination;

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
    private final FilterParser filterParser;
    private final FilterSpecificationConverter filterSpecificationConverter;

    public CreatedResumeResponse create(Resume resume) throws Exception {
        // get current user
        String email = SecurityUtils.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email);
        if (currentUser == null) {
            throw new IdInvalidException("User not found or not logged in");
        }
        resume.setUser(currentUser);
        return ResumeMapper.convertToResCreatedResumeRes(this.resumeRepository.save(resume));
    }

    public Resume fetchResumeById(Long id) throws Exception {
        Optional<Resume> optionalResume = this.resumeRepository.findById(id);
        if (optionalResume.isPresent()) {
            return optionalResume.get();
        } else {
            throw new IdInvalidException("The specified Resume ID is invalid");
        }
    }

    public Resume fetchResumeByIdForView(Long id) throws Exception {
        Resume resume = this.fetchResumeById(id);
        String email = SecurityUtils.getCurrentUserLogin().orElse("");
        User loggedInUser = this.userRepository.findByEmail(email);
        if (loggedInUser == null || loggedInUser.getRole() == null) {
            throw new IdInvalidException("User not found or not logged in");
        }
        String roleName = loggedInUser.getRole().getName();
        if ("SUPER_ADMIN".equals(roleName)) {
            return resume;
        }
        if ("CANDIDATE".equals(roleName)) {
            if (this.resumeRepository.existsByIdAndUserId(id, loggedInUser.getId())) {
                return resume;
            }
            throw new IdInvalidException("You don't have permission to view other people's resume");
        }
        if ("HR_MANAGER".equals(roleName)) {
            if (loggedInUser.getCompany() != null
                    && this.resumeRepository.existsByIdAndApplicationsJobCompanyId(id, loggedInUser.getCompany().getId())) {
                return resume;
            }
            throw new IdInvalidException("You don't have permission to view this resume");
        }
        throw new IdInvalidException("You don't have permission to view this resume");
    }

    public UpdatedResumeResponse update(Resume resume) throws Exception {
        Resume currentResume = this.fetchResumeById(resume.getId());
        // check ownership
        String email = SecurityUtils.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email);
        if (currentUser == null) {
            throw new IdInvalidException("User not found");
        }

        if (currentResume.getUser() == null || !currentResume.getUser().getId().equals(currentUser.getId())) {
            throw new IdInvalidException("You don't have permission to update this resume ");
        }
        currentResume.setTitle(resume.getTitle());
        currentResume.setUrl(resume.getUrl());
        return ResumeMapper.convertToResUpdatedResumeRes(this.resumeRepository.save(currentResume));
    }

    public void delete(Long id) throws Exception {
        Resume currentResume = this.fetchResumeById(id);
        String email = SecurityUtils.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email);
        if (currentUser == null) {
            throw new IdInvalidException("User not found or not logged in");
        }
        if (currentUser.getRole() != null && "SUPER_ADMIN".equals(currentUser.getRole().getName())) {
            this.resumeRepository.deleteById(currentResume.getId());
            return;
        }

        if (currentResume.getUser() == null || !currentResume.getUser().getId().equals(currentUser.getId())) {
            throw new IdInvalidException("You don't have permission to delete this resume");
        }
        this.resumeRepository.deleteById(currentResume.getId());
    }

    public ResultPaginationResponse fetchAllResume(Specification<Resume> spec, Pageable pageable) {
        String email = SecurityUtils.getCurrentUserLogin().orElse("");
        User currentUser = this.userRepository.findByEmail(email);
        Specification<Resume> scope = this.getResumeScope(currentUser);
        Specification<Resume> finalSpec = scope;
        if (spec != null) {
            finalSpec = finalSpec == null ? spec : spec.and(finalSpec);
        }
        Page<Resume> resumePage = this.resumeRepository.findAll(finalSpec, pageable);
        ResultPaginationResponse response = FormatResultPagination.createPaginateResumeRes(resumePage);
        return response;
    }

    private Specification<Resume> getResumeScope(User currentUser) {
        if (currentUser == null || currentUser.getRole() == null) {
            return (root, query, builder) -> builder.disjunction();
        }
        String roleName = currentUser.getRole().getName();
        if ("SUPER_ADMIN".equals(roleName)) {
            return null;
        }
        if ("CANDIDATE".equals(roleName)) {
            Long userId = currentUser.getId();
            return (root, query, builder) -> builder.equal(root.get("user").get("id"), userId);
        }
        if ("HR_MANAGER".equals(roleName)) {
            if (currentUser.getCompany() == null) {
                return (root, query, builder) -> builder.disjunction();
            }
            Long companyId = currentUser.getCompany().getId();
            return (root, query, builder) -> {
                query.distinct(true);
                return builder.equal(root.join("applications").join("job").join("company").get("id"), companyId);
            };
        }
        return (root, query, builder) -> builder.disjunction();
    }

    public ResultPaginationResponse fetchResumeByUser(Pageable pageable) {
        Optional<String> optionalEmail = SecurityUtils.getCurrentUserLogin();
        String email = optionalEmail.orElse("");

        FilterNode node = filterParser.parse("user.email='" + email + "'");
        FilterSpecification<Resume> spec = filterSpecificationConverter.convert(node);

        Page<Resume> resumePage = this.resumeRepository.findAll(spec, pageable);
        return FormatResultPagination.createPaginateResumeRes(resumePage);
    }

}

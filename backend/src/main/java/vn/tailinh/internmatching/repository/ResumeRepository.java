package vn.tailinh.internmatching.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tailinh.internmatching.entity.Resume;

import java.util.List;

@Repository
public interface ResumeRepository extends
        JpaRepository<Resume, Long>,
        JpaSpecificationExecutor<Resume> {
    boolean existsByIdAndUserId(Long id, Long userId);

    boolean existsByIdAndApplicationsJobCompanyId(Long id, Long companyId);

    boolean existsByUrlAndUserId(String url, Long userId);

    boolean existsByUrlAndApplicationsJobCompanyId(String url, Long companyId);

    List<Resume> findByUserId(Long userId);

    List<Resume> findDistinctByApplicationsJobCompanyId(Long companyId);
}

package vn.tailinh.internmatching.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tailinh.internmatching.entity.Resume;

@Repository
public interface ResumeRepository extends
        JpaRepository<Resume, Long>,
        JpaSpecificationExecutor<Resume> {
}

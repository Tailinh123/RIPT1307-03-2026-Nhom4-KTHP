package vn.tailinh.internmatching.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.repository.JobCategoryRepository;

// Pattern giống SkillService.java (đơn giản nhất)
@Service @RequiredArgsConstructor
public class JobCategoryService {
    private final JobCategoryRepository jobCategoryRepository;

    // create(JobCategory) → check name unique → save
    // fetchById(Long id) → find or throw
    // update(JobCategory) → fetch existing → set fields → save
    // delete(Long id) → fetch → detach jobs → delete
    // fetchAll(Specification, Pageable) → paginated response
}
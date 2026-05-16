package vn.tailinh.internmatching.service;

import org.hibernate.query.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.entity.JobCategory;
import vn.tailinh.internmatching.exception.IdInvalidException;
import vn.tailinh.internmatching.repository.JobCategoryRepository;
import vn.tailinh.internmatching.util.response.FormatResultPagaination;


@Service
@RequiredArgsConstructor
public class JobCategoryService {
  private final JobCategoryRepository jobCategoryRepository;

  public JobCategory create(JobCategory jobcategory) throws Exception {
    if (jobCategoryRepository.existsByName(jobcategory.getName())) {
      throw new IdInvalidException("Category name already exists");
    }
    return jobCategoryRepository.save(jobcategory);
  }

  public JobCategory fetchById(Long Id) throws Exception {
    return jobCategoryRepository.findById(Id).orElseThrow(() -> new IdInvalidException("JobCategory not found"));
  }

  public JobCategory update(JobCategory jobCategory) throws Exception {
    JobCategory current = this.fetchById(jobCategory.getId());
    current.setName(jobCategory.getName());
    current.setDescription(jobCategory.getDescription());

    return jobCategoryRepository.save(current);
  }

  public void delete(Long id) throws Exception {
    this.fetchById(id);     //  kiểm tra exists
    jobCategoryRepository.deleteById(id);
  }


  

  


}
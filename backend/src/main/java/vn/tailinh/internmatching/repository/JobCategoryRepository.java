package vn.tailinh.internmatching.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import vn.tailinh.internmatching.entity.JobCategory;

public interface JobCategoryRepository extends JpaRepository<JobCategory , Long > {
  

}

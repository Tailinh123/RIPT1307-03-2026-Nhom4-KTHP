package vn.tailinh.internmatching.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PatchExchange;

import com.turkraft.springfilter.boot.Filter;
import org.springframework.data.domain.Pageable;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.entity.JobCategory;

import vn.tailinh.internmatching.service.JobCategoryService;
import vn.tailinh.internmatching.util.annotation.ApiMessage;



import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RequestMapping(path = "${apiPrefix}/job-categories")
@RestController
@RequiredArgsConstructor
public class JobCategoryController {

  private final JobCategoryService jobCategoryService;

  @PostMapping("")
  @ApiMessage("Create a JobCategory")
  public ResponseEntity<JobCategory> create(@Valid @RequestBody JobCategory jobCategory) throws Exception {
    return ResponseEntity.status(HttpStatus.CREATED).body(this.jobCategoryService.create(jobCategory));
  }

  @PutMapping("")
  @ApiMessage("Update a Jobcategory")
  public ResponseEntity<JobCategory> update(@Valid @RequestBody JobCategory jobCategory) throws Exception {
    return ResponseEntity.ok().body(this.jobCategoryService.update(jobCategory));
  }

  @GetMapping("/{id}")
    public ResponseEntity<JobCategory> fetchById(@PathVariable("id") Long id) throws Exception {
        return ResponseEntity.ok(jobCategoryService.fetchById(id));
    }

  @GetMapping("")
  @ApiMessage("Fetch all JobCategory ")
  public ResponseEntity<ResultPaginationResponse> getAll(@Filter Specification<JobCategory> specification , Pageable pageable) {
    return ResponseEntity.status(HttpStatus.OK).body(this.jobCategoryService.fetchAllJobCategory(specification , pageable));
  }

  @DeleteMapping("/{id}")
  @ApiMessage("Delete a JobCategory")
  public ResponseEntity<Void> delete(@PathVariable("id") Long id) throws Exception{
    this.jobCategoryService.delete(id);
    return ResponseEntity.ok().body(null);
  }

}

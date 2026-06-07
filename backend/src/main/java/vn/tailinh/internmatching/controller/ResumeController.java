package vn.tailinh.internmatching.controller;

import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.dto.response.resume.CreatedResumeResponse;
import vn.tailinh.internmatching.dto.response.resume.FetchResumeResponse;
import vn.tailinh.internmatching.dto.response.resume.UpdatedResumeResponse;
import vn.tailinh.internmatching.entity.Resume;
import vn.tailinh.internmatching.service.ResumeService;
import vn.tailinh.internmatching.util.annotation.ApiMessage;
import vn.tailinh.internmatching.util.mapper.ResumeMapper;


import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RequestMapping(path = "${apiPrefix}/resumes")
@RequiredArgsConstructor
@RestController
public class ResumeController {
    private final ResumeService resumeService;


    @PostMapping("")
    @ApiMessage("Create a resume")
    public ResponseEntity<CreatedResumeResponse> create(@Valid @RequestBody Resume resume) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.resumeService.create(resume));
    }


    @PutMapping("")
    @ApiMessage("Update a resume")
    public ResponseEntity<UpdatedResumeResponse> update(@Valid @RequestBody Resume resume) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(this.resumeService.update(resume));
    }


    @DeleteMapping("/{id}")
    @ApiMessage("Delete a resume")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) throws Exception{
        this.resumeService.delete(id);
        return ResponseEntity.ok().body(null);
    }


    @GetMapping("/{id}")
    @ApiMessage("Fetch a resume by id")
    public ResponseEntity<FetchResumeResponse> fetchById(@PathVariable("id") Long id) throws Exception {

        return ResponseEntity.status(HttpStatus.OK).body(
                ResumeMapper.convertToResFetchResumeRes(this.resumeService.fetchResumeByIdForView(id))
        );
    }


    @GetMapping("")
    @ApiMessage("fetch all resume")
    public ResponseEntity<ResultPaginationResponse> getAll(
            @Filter Specification<Resume> specification,
            Pageable pageable
    ){
      return ResponseEntity.ok().body(this.resumeService.fetchAllResume(specification, pageable));
    }
  

    @GetMapping("/by-user")
    @ApiMessage("Get list resumes by user")
    public ResponseEntity<ResultPaginationResponse> fetchResumeByUser(Pageable pageable) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(this.resumeService.fetchResumeByUser(pageable));
    }
}

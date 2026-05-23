package vn.tailinh.internmatching.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.Job;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.dto.response.job.CreateJobDTOResponse;
import vn.tailinh.internmatching.dto.response.job.UpdatedJobResponse;
import vn.tailinh.internmatching.service.JobService;
import vn.tailinh.internmatching.util.annotation.ApiMessage;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RequestMapping(path = "${apiPrefix}/jobs")
@RequiredArgsConstructor
@RestController
public class JobController {
    private final JobService jobService;

    @PostMapping("")
    @ApiMessage("Create a job")
    public ResponseEntity<CreateJobDTOResponse> create(@Valid @RequestBody Job job){
        return ResponseEntity.status(HttpStatus.CREATED).body(
                this.jobService.create(job)
        );
    }

    @PutMapping("")
    @ApiMessage("Update a job")
    public ResponseEntity<UpdatedJobResponse> update(@Valid @RequestBody Job job) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(this.jobService.update(job));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete job by id")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) throws Exception{
        this.jobService.delete(id);
        return ResponseEntity.ok().body(null);
    }

    @GetMapping("/{id}")
    @ApiMessage("Get job by id")
    public ResponseEntity<Job> getJob(@PathVariable("id") Long id) throws Exception{
        return ResponseEntity.ok().body(this.jobService.fetchJobById(id));
    }

    @GetMapping("")
    @ApiMessage("fetch all jobs")
    public ResponseEntity<ResultPaginationResponse> getAll(
            @Filter Specification<Job> spec,
            Pageable pageable
    ){
        return ResponseEntity.status(HttpStatus.OK).body(
                this.jobService.fetchAllJob(spec, pageable)
        );
    }
}

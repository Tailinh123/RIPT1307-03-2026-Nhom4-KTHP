package vn.tailinh.internmatching.controller;

import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import vn.tailinh.internmatching.dto.request.application.UpdateApplicationDTO;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.dto.response.application.CreateApplicationResponse;
import vn.tailinh.internmatching.dto.response.application.UpdateApplicationResponse;
import vn.tailinh.internmatching.entity.Application;
import vn.tailinh.internmatching.service.ApplicationService;
import vn.tailinh.internmatching.util.annotation.ApiMessage;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RequestMapping(path = "${apiPrefix}/applications")

@RestController
@RequiredArgsConstructor
public class ApplicationController {
  private final ApplicationService applicationService;

  @PostMapping("")
  @ApiMessage("Create an application status")
  public ResponseEntity<CreateApplicationResponse> create(
      @Valid @RequestBody Application application) throws Exception {
    return ResponseEntity.status(HttpStatus.CREATED).body(this.applicationService.create(application));
  }


  @PutMapping("")
  @ApiMessage("Update an application startus")
  public ResponseEntity<UpdateApplicationResponse> update(@Valid @RequestBody UpdateApplicationDTO dto) throws Exception {
    return ResponseEntity.ok(applicationService.update(dto));
  }


  @GetMapping("")
  @ApiMessage("fetch all applications")
  public ResponseEntity<ResultPaginationResponse> fetchAll(
      @Filter Specification<Application> specification, Pageable pageable) {
    return ResponseEntity.ok().body(this.applicationService.fetchAllApplication(specification, pageable));
  }

  @DeleteMapping("/{id}")
  @ApiMessage("Delete a application")
  public ResponseEntity<Void> delete(@PathVariable("id") Long id) throws Exception {
    this.applicationService.deleteApplication(id);
    return ResponseEntity.ok().body(null);
  }

  @PostMapping("/by-user")
  public ResponseEntity<ResultPaginationResponse> fetchByUser(Pageable pageable) {
    return ResponseEntity.ok(applicationService.fetchByUser(pageable));
  }

}

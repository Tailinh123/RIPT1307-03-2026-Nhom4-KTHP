package vn.tailinh.internmatching.controller;

import org.springframework.web.bind.annotation.RestController;

import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.dto.request.application.CreateApplicationDTO;
import vn.tailinh.internmatching.dto.request.application.UpdateApplicationDTO;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.dto.response.application.CreateApplicationResponse;
import vn.tailinh.internmatching.entity.Application;
import vn.tailinh.internmatching.service.ApplicationService;
import vn.tailinh.internmatching.util.annotation.ApiMessage;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springdoc.core.converters.models.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.method.P;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;



@RequestMapping(path = "${apiPrefix}/applications")

@RestController
@RequiredArgsConstructor

public class ApplicationController {
  private final ApplicationService applicationService;


  @PostMapping("")
  @ApiMessage("Create an application")
  public ResponseEntity<CreateApplicationResponse> create(
    @Valid @RequestBody CreateApplicationDTO  dto ) throws Exception {
      return ResponseEntity.status(HttpStatus.CREATED).body(this.applicationService.create(dto));
    }

    @PutMapping("")
    @ApiMessage("Update a skill ")
    public ResponseEntity<UpdateApplicationDTO> update(@Valid @RequestBody UpdateApplicationDTO dto )  throws Exception {
      return ResponseEntity.ok().body(this.applicationService.update(dto));
    }
    
    @GetMapping("")
    @ApiMessage("fetch all skills")
    public ResponseEntity<ResultPaginationResponse> fetchAll(
      @Filter Specification<Application> specification , Pageable pageable ) {
        return ResponseEntity.ok().body(this.applicationService.fetchAllSkill(specification , pageable));
      }

        @DeleteMapping("/{id}")
    @ApiMessage("Delete a application")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) throws Exception{
        this.applicationService.deleteApplication(id);
        return ResponseEntity.ok().body(null);
    }
  
    
  
  }
  

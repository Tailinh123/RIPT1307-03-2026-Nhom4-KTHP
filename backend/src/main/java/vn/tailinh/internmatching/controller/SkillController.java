package vn.tailinh.internmatching.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.Skill;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.service.SkillService;
import vn.tailinh.internmatching.util.annotation.ApiMessage;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping(path = "${apiPrefix}/skills")
@RequiredArgsConstructor
@RestController
public class SkillController {
    private final SkillService skillService;

    @PostMapping("")
    @ApiMessage("Create a skill")
    public ResponseEntity<Skill> create(@Valid @RequestBody Skill skill) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.skillService.create(skill));
    }
    
    @PutMapping("")
    @ApiMessage("Update a skill")
    public ResponseEntity<Skill> update(@Valid @RequestBody Skill skill) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(this.skillService.update(skill));
    }

    @GetMapping("")
    @ApiMessage("fetch all skills")
    public ResponseEntity<ResultPaginationResponse> getAll(
            @Filter Specification<Skill> spec,
            Pageable pageable
            ){
        return ResponseEntity.status(HttpStatus.OK).body(
                this.skillService.fetchAllSkill(spec, pageable)
        );
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a skill")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) throws Exception{
        this.skillService.deleteSkill(id);
        return ResponseEntity.ok().body(null);
    }
}

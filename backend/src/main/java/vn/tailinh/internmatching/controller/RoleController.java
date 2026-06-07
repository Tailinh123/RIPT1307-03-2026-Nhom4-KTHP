package vn.tailinh.internmatching.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.Role;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.service.RoleService;
import vn.tailinh.internmatching.util.annotation.ApiMessage;


import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping(path = "${apiPrefix}/roles")
@RestController
@RequiredArgsConstructor
public class RoleController {
    private final RoleService roleService;

    @PostMapping("")
    @ApiMessage("Create a role")
    public ResponseEntity<Role> create(@Valid @RequestBody Role role) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.roleService.create(role));
    }

    @PutMapping("")
    @ApiMessage("Update a role")
    public ResponseEntity<Role> update(@Valid @RequestBody Role role) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(this.roleService.update(role));
    }

    @GetMapping("")
    @ApiMessage("fetch all role")
    public ResponseEntity<ResultPaginationResponse> getAll(
            @Filter Specification<Role> spec,
            Pageable pageable
    ){
        return ResponseEntity.status(HttpStatus.OK).body(
                this.roleService.fetchAll(spec, pageable)
        );
    }

    @GetMapping("/{id}")
    @ApiMessage("Fetch a role by id")
    public ResponseEntity<Role> fetchById(@PathVariable("id") Long id) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(this.roleService.fetchRoleById(id));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a role")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) throws Exception{
        this.roleService.delete(id);
        return ResponseEntity.ok().body(null);
    }
}

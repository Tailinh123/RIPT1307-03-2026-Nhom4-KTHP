package vn.tailinh.internmatching.controller;

import com.turkraft.springfilter.boot.Filter;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.Company;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.service.CompanyService;
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


@RequestMapping(path = "${apiPrefix}/companies")
@RestController
@RequiredArgsConstructor
public class CompanyController {
    private final CompanyService companyService;

    @PostMapping("")
    @ApiMessage("Create a company")
    public ResponseEntity<Company> createCompany(@Valid @RequestBody Company company) throws Exception {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(this.companyService.createCompany(company));
    }

    @GetMapping("")
    @ApiMessage("Fetch all company data")
    public ResponseEntity<ResultPaginationResponse> getAllCompany(
            @Filter Specification<Company> spec,
            Pageable pageable) {
        return ResponseEntity.status(HttpStatus.OK)
                .body(this.companyService.getAllCompany(pageable, spec));
    }

    @PutMapping("")
    @ApiMessage("Update a company")
    public ResponseEntity<Company> updateCompany(
            @Valid @RequestBody Company company) throws Exception {
        return ResponseEntity.status(HttpStatus.OK).body(this.companyService.updateCompany(company));
    }

    @DeleteMapping("/{id}")
    @ApiMessage("Delete a company")
    public ResponseEntity<Void> deleteCompany(
            @PathVariable("id") Long id) throws Exception {
        this.companyService.deleteCompany(id);
        return ResponseEntity.ok(null);
    }

    @GetMapping("/{id}")
    @ApiMessage("Get company by id")
    public ResponseEntity<Company> getCompany(@PathVariable("id") Long id) throws Exception {
        return ResponseEntity.ok().body(this.companyService.findCompanyById(id));
    }
}

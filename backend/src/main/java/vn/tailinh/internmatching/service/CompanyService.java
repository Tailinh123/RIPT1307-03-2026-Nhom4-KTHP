package vn.tailinh.internmatching.service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.exception.IdInvalidException;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.repository.CompanyRepository;
import vn.tailinh.internmatching.repository.UserRepository;
import vn.tailinh.internmatching.util.response.FormatResultPagination;
import vn.tailinh.internmatching.entity.Company;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class CompanyService {
  private final CompanyRepository companyRepository;
  private final UserRepository userRepository;

  public Company createCompany(Company company) {
    return companyRepository.save(company);
  }

  public ResultPaginationResponse getAllCompany(Pageable pageable, Specification<Company> spec) {
    Page<Company> companyPage = companyRepository.findAll(spec, pageable);
    ResultPaginationResponse response = FormatResultPagination.createPaginationResponse(companyPage);
    return response;
  }

  public Company findCompanyById(Long id) throws Exception {
    Optional<Company> companyOptional = this.companyRepository.findById(id);
    return companyOptional.orElseThrow(() -> new IdInvalidException("Company not found"));
  }

  public Company updateCompany(Company company) throws Exception {
    Optional<Company> companyOptional = this.companyRepository.findById(company.getId());
      if(companyOptional.isEmpty()){
        throw new IdInvalidException("Company not found");
      } 
      Company currentCompany = companyOptional.get();
      currentCompany.setName(company.getName());
      currentCompany.setLogoUrl(company.getLogoUrl());
      currentCompany.setDescription(company.getDescription());
      currentCompany.setAddress(company.getAddress());
      return this.companyRepository.save(currentCompany);
    }
  

  public void deleteCompany(Long id) throws Exception {
    if(!this.companyRepository.existsById(id)) {
      throw new IdInvalidException("Company not found");
    }
    this.companyRepository.deleteById(id);
  }
}

package vn.tailinh.internmatching.service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.entity.User;
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

  public Company findCompanyById(Long id) {
    Optional<Company> companyOptional = this.companyRepository.findById(id);
    return companyOptional.orElse(null);
  }

  public Company updateCompany(Company company) {
    Optional<Company> companyOptional = this.companyRepository.findById(company.getId());
    if (companyOptional.isPresent()) {
      Company currentCompany = companyOptional.get();
      currentCompany.setName(company.getName());
      currentCompany.setLogoUrl(company.getLogoUrl());
      currentCompany.setDescription(company.getDescription());
      currentCompany.setAddress(company.getAddress());
      return this.companyRepository.save(currentCompany);
    }
    return null;
  }

  public void deleteCompany(Long id) {
    Optional<Company> companyOptional = this.companyRepository.findById(id);
    if (companyOptional.isPresent()) {
      Company company = companyOptional.get();
      List<User> users = this.userRepository.findByCompany(company);
      users.forEach(u -> u.setCompany(null));
      this.userRepository.saveAll(users);
      this.companyRepository.deleteById(id);
    }
  }
}

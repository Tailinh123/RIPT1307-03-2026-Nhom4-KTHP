package vn.tailinh.internmatching.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import vn.tailinh.internmatching.entity.Company;



@Repository
public interface CompanyRepository
        extends
        JpaRepository<Company, Long>,
        JpaSpecificationExecutor<Company>
{
}

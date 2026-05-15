package vn.tailinh.internmatching.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import vn.tailinh.internmatching.entity.Application;


public interface ApplicationRepository extends JpaRepository< Application , Long > ,JpaSpecificationExecutor<Application> {
}

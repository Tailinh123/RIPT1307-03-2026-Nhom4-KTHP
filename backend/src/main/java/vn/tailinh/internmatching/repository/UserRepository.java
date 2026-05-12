package vn.tailinh.internmatching.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.entity.Company;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {
    boolean existsByEmail(String email);
    User findByEmail(String email);
    User findByRefreshTokenAndEmail(String token,String email);
    List<User> findByCompany(Company company);

    //Lấy User theo ID và ép load luôn mảng Skills (xem chi tiết Profile/Matching)
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.skills WHERE u.id = :id")
    Optional<User> findByIdWithSkills(@Param("id") Long id);

    // Lấy User theo Email và ép load luôn Skills ( User vừa login xong muốn xem Profile)
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.skills WHERE u.email = :email")
    User findByEmailWithSkills(@Param("email") String email);
}

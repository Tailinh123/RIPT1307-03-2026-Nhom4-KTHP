package vn.tailinh.internmatching.util.mapper;

import vn.tailinh.internmatching.entity.User;
import vn.tailinh.internmatching.dto.response.user.CompanyUser;
import vn.tailinh.internmatching.dto.response.user.CreatedUserResponse;
import vn.tailinh.internmatching.dto.response.user.ResUserDTO;
import vn.tailinh.internmatching.dto.response.user.UpdatedUserResponse;

public class UserMapper {
    public static CreatedUserResponse convertToResCreatedUserRes(User user){
        CreatedUserResponse res = new CreatedUserResponse();
        CompanyUser companyUser = new CompanyUser();
        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setAddress(user.getAddress());
        res.setDateOfBirth(user.getDateOfBirth());
        res.setCreatedAt(user.getCreatedAt());
        res.setCreatedBy(user.getCreatedBy());
        res.setGender(user.getGender());
        res.setName(user.getName());
        res.setPhone(user.getPhone());
        res.setAvatarUrl(user.getAvatarUrl());
        res.setActive(user.isActive());

        if(user.getCompany() != null){
            companyUser.setId(user.getCompany().getId());
            companyUser.setName(user.getCompany().getName());
            res.setCompany(companyUser);
        }
        if(user.getRole() != null){
          res.setRole(user.getRole());
        }
        return res;
    }



    public static UpdatedUserResponse convertToResUpdatedUserRes(User user){
        UpdatedUserResponse res = new UpdatedUserResponse();
        CompanyUser companyUser = new CompanyUser();

        res.setId(user.getId());
        res.setAddress(user.getAddress());
        res.setDateOfBirth(user.getDateOfBirth());
        res.setGender(user.getGender());
        res.setName(user.getName());
        if(user.getCompany() != null){
            companyUser.setId(user.getCompany().getId());
            companyUser.setName(user.getCompany().getName());
            res.setCompany(companyUser);
        }
        if(user.getRole() != null){
            res.setRole(user.getRole());
        }
        return res;
    }

    
    public static ResUserDTO convertToUserDTO(User user){
      ResUserDTO res = new ResUserDTO();
      res.setId(user.getId());
      res.setAddress(user.getAddress());
      res.setDateOfBirth(user.getDateOfBirth());
      res.setEmail(user.getEmail());
      res.setGender(user.getGender());
      res.setName(user.getName());
      res.setSubscribed(user.isSubscribed());
      res.setAvatarUrl(user.getAvatarUrl());
      res.setSkills(user.getSkills());

      //set Role Convert
      if(user.getRole() != null){
      ResUserDTO.RoleDTO role = new ResUserDTO.RoleDTO();
      role.setId(user.getRole().getId());
      role.setName(user.getRole().getName());
      res.setRole(role);
      }


      //set Company Convert
      if(user.getCompany() != null){
      ResUserDTO.CompanyDTO company = new ResUserDTO.CompanyDTO();
      company.setId(user.getCompany().getId());
      company.setName(user.getCompany().getName());
      res.setCompany(company);
      }
      return res;
    }
  }


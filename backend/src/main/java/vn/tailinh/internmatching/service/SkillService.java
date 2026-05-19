package vn.tailinh.internmatching.service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.dto.response.ResultPaginationResponse;
import vn.tailinh.internmatching.exception.IdInvalidException;
import vn.tailinh.internmatching.repository.SkillRepository;
import vn.tailinh.internmatching.util.response.FormatResultPagination;
import vn.tailinh.internmatching.entity.Skill;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class SkillService {
    private final SkillRepository skillRepository;

    public Skill create(Skill skill) throws Exception{
        if(this.skillRepository.existsByName(skill.getName())){
            throw new DataIntegrityViolationException("Skill name already exists");
        }
        return this.skillRepository.save(skill);
    }

    public Skill fetchSkillById(Long id) throws Exception {
        if(this.skillRepository.existsById(id)){
            return this.skillRepository.findById(id).get();
        }else{
            throw new IdInvalidException("The specified Skill ID is invalid");
        }
    }

    public Skill update(Skill skill) throws Exception{
        Skill currentSkill = this.fetchSkillById(skill.getId());
        if(skill.getName() != null && this.skillRepository.existsByName(skill.getName())){
            throw new DataIntegrityViolationException("Skill name already exists");
        }
        currentSkill.setName(skill.getName());
        return this.skillRepository.save(currentSkill);
    }

    public ResultPaginationResponse fetchAllSkill(Specification<Skill> spec, Pageable pageable){
        Page<Skill> skillPage = this.skillRepository.findAll(spec, pageable);
        ResultPaginationResponse response = FormatResultPagination.createPaginationResponse(skillPage);
        return response;
    }

    public void deleteSkill(Long id) throws Exception {
        Skill currentSkill = this.fetchSkillById(id);
        if(currentSkill == null){
            throw new IdInvalidException("Skill ID is not found");
        }
        currentSkill.getJobs().forEach(
                job -> job.getSkills().remove(currentSkill)
        );
        currentSkill.getJobs().forEach(
                subs -> subs.getSkills().remove(currentSkill)
        );
        this.skillRepository.delete(currentSkill);
    }
}

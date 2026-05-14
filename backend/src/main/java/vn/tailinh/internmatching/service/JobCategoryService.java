package vn.tailinh.internmatching.service;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.repository.JobCategoryRepository;

@Service @RequiredArgsConstructor
public class JobCategoryService {
    private final JobCategoryRepository jobCategoryRepository;


}
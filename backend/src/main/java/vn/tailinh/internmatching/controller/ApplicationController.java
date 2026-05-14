package vn.tailinh.internmatching.controller;

import org.springframework.web.bind.annotation.RestController;


import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.service.ApplicationService;

@RestController
@RequiredArgsConstructor

public class ApplicationController {
  private final ApplicationService applicationService;


}

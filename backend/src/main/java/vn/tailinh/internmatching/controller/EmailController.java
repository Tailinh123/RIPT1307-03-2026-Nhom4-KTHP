package vn.tailinh.internmatching.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import vn.tailinh.internmatching.service.EmailService;
import vn.tailinh.internmatching.util.annotation.ApiMessage;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = "${apiPrefix}/email")
public class EmailController {
  private final EmailService emailService;

  @GetMapping("")
  @ApiMessage("Send email")
  public ResponseEntity<String> sendEmail() {
    this.emailService.sendApplicationNotification(
        "linhfunny2@gmail.com", 
        "Test - Thông báo kết quả ứng tuyển",
        "application-notification", 
        "Nguyen Tai Linh",
        "Java Developer Intern",
        "Công ty KAWASAKI",
        "APPROVED",
        "Chúc mừng bạn đã trúng tuyển! Vui lòng liên hệ HR để trao đổi thêm."
      );
        return ResponseEntity.ok().body("Email sent successfully!");
  }
}

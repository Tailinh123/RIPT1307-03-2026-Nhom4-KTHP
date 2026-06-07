package vn.tailinh.internmatching.service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.nio.charset.StandardCharsets;


@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.from:}")
    private String mailFrom;


    public void sendEmailSync(String to, String subject, String content, boolean isMultipart,
                              boolean isHtml) {
        if (!StringUtils.hasText(mailUsername)) {
            System.out.println("ERROR SEND EMAIL: MAIL_USERNAME is missing. Configure SMTP credentials before sending email.");
            return;
        }

        // Prepare message using a Spring helper
        MimeMessage mimeMessage = this.javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper message = new MimeMessageHelper(mimeMessage,
                    isMultipart, StandardCharsets.UTF_8.name());
            message.setFrom(StringUtils.hasText(mailFrom) ? mailFrom : mailUsername);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(content, isHtml);
            this.javaMailSender.send(mimeMessage);
            System.out.println("EMAIL SENT to " + to + " with subject: " + subject);
        } catch (MailException | MessagingException e) {
            System.out.println("ERROR SEND EMAIL to " + to + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Async
    public void sendEmailFromTemplateSync(String to, String subject, String
            templateName, String username, Object value) {
        Context context = new Context();
        context.setVariable("name", username);
        context.setVariable("jobs", value);

        String content = this.templateEngine.process(templateName, context);
        this.sendEmailSync(to, subject, content, false, true);
    }


    @Async 
    public void sendApplicationNotification(String to , String subject , String templateName , String userName , String jobName , String companyName , String status , String note ) {
      Context context = new Context();
      context.setVariable("userName" , userName);
      context.setVariable("jobName", jobName);
        context.setVariable("companyName", companyName);
        context.setVariable("status", status);
        context.setVariable("note", note);

        String content = this.templateEngine.process(templateName , context );
        this.sendEmailSync(to, subject, content, false, true);
    }

    
}

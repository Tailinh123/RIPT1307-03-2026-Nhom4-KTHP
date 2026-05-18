package vn.tailinh.internmatching.config.web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import vn.tailinh.internmatching.security.SpringSecurityAuditorAware;

@Configuration
@EnableJpaAuditing(auditorAwareRef = "springSecurityAuditorAware")
public class AuditingConfig {
    @Bean
    public AuditorAware<String> springSecurityAuditorAware() {
        return new SpringSecurityAuditorAware();
    }
}
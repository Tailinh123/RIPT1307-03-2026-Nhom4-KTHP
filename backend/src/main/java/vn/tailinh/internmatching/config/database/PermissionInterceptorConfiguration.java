package vn.tailinh.internmatching.config.database;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import vn.tailinh.internmatching.config.web.PermissionInterceptor;

@Configuration
public class PermissionInterceptorConfiguration implements WebMvcConfigurer {

  @Bean
  PermissionInterceptor getPermissionInterceptor() {
    return new PermissionInterceptor();
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    String[] whiteList = {
        "/", "/api/v1/auth/**",
        "/storage/**",
        "/api/v1/subscribers/**",
        "/api/v1/users/change-password",
    };
    registry.addInterceptor(getPermissionInterceptor())
        .excludePathPatterns(whiteList);
  }
}

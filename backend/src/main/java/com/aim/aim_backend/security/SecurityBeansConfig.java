package com.aim.aim_backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.userdetails.UserDetailsService;

import com.aim.aim_backend.service.AppUserDetailsService;

// @Configuration
public class SecurityBeansConfig {
    @Bean
    public UserDetailsService userDetailsService(AppUserDetailsService svc) {
        return svc;
    }
}



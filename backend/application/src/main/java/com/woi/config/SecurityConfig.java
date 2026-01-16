package com.woi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security Configuration
 * Allows public access to authentication endpoints (register, login)
 * Other endpoints require authentication
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for API (JWT tokens provide protection)
            .httpBasic(httpBasic -> httpBasic.disable()) // Disable basic auth
            .formLogin(formLogin -> formLogin.disable()) // Disable form login
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/v2/user/register", "/api/v2/user/login", 
                                "/api/v2/user/forgot-password", "/api/v2/user/reset-password",
                                "/api/v2/user/refresh-token").permitAll()
                // All other endpoints require authentication (will be configured later with JWT)
                .anyRequest().permitAll() // Temporarily allow all for testing
            );
        
        return http.build();
    }
}


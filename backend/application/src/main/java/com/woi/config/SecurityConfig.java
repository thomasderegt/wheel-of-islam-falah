package com.woi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.cors.CorsConfiguration;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security Configuration
 * Allows public access to authentication endpoints (register, login)
 * Other endpoints require authentication
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final SecurityHeadersFilter securityHeadersFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          SecurityHeadersFilter securityHeadersFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.securityHeadersFilter = securityHeadersFilter;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(
                "http://localhost:3000", "http://localhost:3001",
                "http://127.0.0.1:3000", "http://127.0.0.1:3001",
                "https://wheel-of-islam-falah.vercel.app"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable()) // Disable CSRF for API (JWT tokens provide protection)
            .httpBasic(httpBasic -> httpBasic.disable()) // Disable basic auth
            .formLogin(formLogin -> formLogin.disable()) // Disable form login
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .addFilterBefore(securityHeadersFilter, UsernamePasswordAuthenticationFilter.class)
            .exceptionHandling(ex -> ex
                .accessDeniedHandler(accessDeniedHandler()))
            .authorizeHttpRequests(auth -> auth
                // CORS preflight (browser sends OPTIONS before POST)
                .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                // Public auth endpoints (with and without trailing slash for robustness)
                .requestMatchers(
                    "/api/v2/user/register", "/api/v2/user/register/",
                    "/api/v2/user/login", "/api/v2/user/login/",
                    "/api/v2/user/forgot-password", "/api/v2/user/forgot-password/",
                    "/api/v2/user/reset-password", "/api/v2/user/reset-password/",
                    "/api/v2/user/refresh", "/api/v2/user/refresh/",
                    "/api/v2/user/refresh-token", "/api/v2/user/refresh-token/"
                ).permitAll()
                // Team invitation links (token in URL, user may not be logged in yet)
                .requestMatchers("/api/v2/users/teams/invitations/*/accept",
                                "/api/v2/users/teams/invitations/*/decline").permitAll()
                // All other endpoints require authentication
                .anyRequest().authenticated()
            );
        
        return http.build();
    }

    /** Return 403 with JSON body so the client always gets a message (e.g. when CORS would hide empty body). */
    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (HttpServletRequest request, HttpServletResponse response,
                org.springframework.security.access.AccessDeniedException accessDeniedException) -> {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setCharacterEncoding(StandardCharsets.UTF_8.name());
            String body = "{\"error\":\"Access denied\"}";
            response.getWriter().write(body);
        };
    }
}


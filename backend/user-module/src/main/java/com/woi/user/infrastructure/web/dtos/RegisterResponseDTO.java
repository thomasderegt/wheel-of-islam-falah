package com.woi.user.infrastructure.web.dtos;

import com.woi.user.domain.enums.UserStatus;
import java.time.LocalDateTime;

/**
 * DTO for user registration response
 */
public class RegisterResponseDTO {
    private Long id;
    private String email;
    private String profileName;
    private UserStatus status;
    private LocalDateTime createdAt;
    
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getProfileName() { return profileName; }
    public void setProfileName(String profileName) { this.profileName = profileName; }
    
    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


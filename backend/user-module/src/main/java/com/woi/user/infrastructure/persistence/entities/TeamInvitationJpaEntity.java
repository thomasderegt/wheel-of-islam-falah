package com.woi.user.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for TeamInvitation
 * Maps to database table users.team_invitations
 */
@Entity
@Table(name = "team_invitations", schema = "users")
public class TeamInvitationJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "team_id", nullable = false)
    private Long teamId;
    
    @Column(name = "email", nullable = false, length = 255)
    private String email;
    
    @Column(name = "role", nullable = false, length = 50)
    private String role;
    
    @Column(name = "invited_by_id", nullable = false)
    private Long invitedById;
    
    @Column(name = "token", nullable = false, unique = true, length = 255)
    private String token;
    
    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;
    
    @Column(name = "accepted_at")
    private LocalDateTime acceptedAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Protected constructor - JPA requirement
    public TeamInvitationJpaEntity() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public Long getInvitedById() { return invitedById; }
    public void setInvitedById(Long invitedById) { this.invitedById = invitedById; }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }
    
    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

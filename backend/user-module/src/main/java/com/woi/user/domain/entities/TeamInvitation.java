package com.woi.user.domain.entities;

import com.woi.user.domain.enums.TeamRole;
import java.time.LocalDateTime;

/**
 * TeamInvitation domain entity - Pure POJO (no JPA annotations)
 * 
 * Business rules:
 * - teamId, email, invitedById, token, and expiresAt are required
 * - role defaults to MEMBER
 * - Token must be unique
 */
public class TeamInvitation {
    private Long id;
    private Long teamId;
    private String email;
    private TeamRole role;
    private Long invitedById;
    private String token;
    private LocalDateTime expiresAt;
    private LocalDateTime acceptedAt;
    private LocalDateTime createdAt;
    
    // Private constructor
    private TeamInvitation() {}
    
    /**
     * Factory method: Create a new team invitation
     */
    public static TeamInvitation create(
        Long teamId,
        String email,
        TeamRole role,
        Long invitedById,
        String token,
        LocalDateTime expiresAt
    ) {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be null or empty");
        }
        if (invitedById == null) {
            throw new IllegalArgumentException("Invited by ID cannot be null");
        }
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }
        if (expiresAt == null) {
            throw new IllegalArgumentException("Expires at cannot be null");
        }
        
        TeamInvitation invitation = new TeamInvitation();
        invitation.teamId = teamId;
        invitation.email = email.trim().toLowerCase();
        invitation.role = role != null ? role : TeamRole.MEMBER;
        invitation.invitedById = invitedById;
        invitation.token = token;
        invitation.expiresAt = expiresAt;
        invitation.createdAt = LocalDateTime.now();
        return invitation;
    }
    
    /**
     * Accept the invitation
     */
    public void accept() {
        if (this.acceptedAt != null) {
            throw new IllegalStateException("Invitation already accepted");
        }
        if (LocalDateTime.now().isAfter(this.expiresAt)) {
            throw new IllegalStateException("Invitation has expired");
        }
        this.acceptedAt = LocalDateTime.now();
    }
    
    /**
     * Check if invitation is expired
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiresAt);
    }
    
    /**
     * Check if invitation is accepted
     */
    public boolean isAccepted() {
        return this.acceptedAt != null;
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getTeamId() { return teamId; }
    public String getEmail() { return email; }
    public TeamRole getRole() { return role; }
    public Long getInvitedById() { return invitedById; }
    public String getToken() { return token; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public LocalDateTime getAcceptedAt() { return acceptedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    // Setters for mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setAcceptedAt(LocalDateTime acceptedAt) { this.acceptedAt = acceptedAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

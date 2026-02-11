package com.woi.user.domain.entities;

import com.woi.user.domain.enums.TeamMemberStatus;
import com.woi.user.domain.enums.TeamRole;
import java.time.LocalDateTime;

/**
 * TeamMember domain entity - Pure POJO (no JPA annotations)
 * 
 * Business rules:
 * - teamId and userId are required
 * - role defaults to MEMBER
 * - status defaults to ACTIVE
 * - One membership per user per team (enforced by unique constraint)
 */
public class TeamMember {
    private Long id;
    private Long teamId; // Required - FK to teams
    private Long userId; // Required - FK to users
    private TeamRole role;
    private TeamMemberStatus status;
    private Long invitedById; // Who invited this member
    private LocalDateTime joinedAt;
    private LocalDateTime leftAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Private constructor
    private TeamMember() {}
    
    /**
     * Factory method: Create a new team member
     */
    public static TeamMember create(Long teamId, Long userId, TeamRole role, Long invitedById) {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (role == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }
        
        TeamMember member = new TeamMember();
        member.teamId = teamId;
        member.userId = userId;
        member.role = role;
        member.status = TeamMemberStatus.ACTIVE;
        member.invitedById = invitedById;
        member.joinedAt = LocalDateTime.now();
        member.createdAt = LocalDateTime.now();
        member.updatedAt = LocalDateTime.now();
        return member;
    }
    
    /**
     * Create an invitation (not yet accepted)
     */
    public static TeamMember createInvitation(Long teamId, Long userId, TeamRole role, Long invitedById) {
        TeamMember member = create(teamId, userId, role, invitedById);
        member.status = TeamMemberStatus.INVITED;
        member.joinedAt = null; // Not joined yet
        return member;
    }
    
    /**
     * Accept invitation
     */
    public void acceptInvitation() {
        if (this.status != TeamMemberStatus.INVITED) {
            throw new IllegalStateException("Can only accept invitations");
        }
        this.status = TeamMemberStatus.ACTIVE;
        this.joinedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Update role
     */
    public void updateRole(TeamRole newRole) {
        if (newRole == null) {
            throw new IllegalArgumentException("Role cannot be null");
        }
        this.role = newRole;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Leave the team
     */
    public void leave() {
        this.status = TeamMemberStatus.LEFT;
        this.leftAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getTeamId() { return teamId; }
    public Long getUserId() { return userId; }
    public TeamRole getRole() { return role; }
    public TeamMemberStatus getStatus() { return status; }
    public Long getInvitedById() { return invitedById; }
    public LocalDateTime getJoinedAt() { return joinedAt; }
    public LocalDateTime getLeftAt() { return leftAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    // Setters for mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setStatus(TeamMemberStatus status) { this.status = status; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
    public void setLeftAt(LocalDateTime leftAt) { this.leftAt = leftAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

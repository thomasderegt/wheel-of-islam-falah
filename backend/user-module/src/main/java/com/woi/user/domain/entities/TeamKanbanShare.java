package com.woi.user.domain.entities;

import java.time.LocalDateTime;

/**
 * TeamKanbanShare domain entity - Pure POJO (no JPA annotations)
 * 
 * Represents a shared kanban board for a team.
 * Only the team owner can share their kanban board with team members.
 * Team members can view the board in read-only mode.
 * 
 * Business rules:
 * - teamId and ownerUserId are required
 * - Only one active share per team (enforced by unique constraint)
 * - Unshare is a soft delete (sets unsharedAt timestamp)
 */
public class TeamKanbanShare {
    private Long id;
    private Long teamId; // Required - Team that has the shared board
    private Long ownerUserId; // Required - User who owns and shares the board (must be team owner)
    private LocalDateTime sharedAt; // When the board was shared
    private LocalDateTime unsharedAt; // When the board was unshared (NULL = active)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private TeamKanbanShare() {}
    
    /**
     * Factory method: Create a new team kanban share
     * 
     * @param teamId Team ID (required)
     * @param ownerUserId Owner user ID (required, must be team owner)
     * @return New TeamKanbanShare instance
     * @throws IllegalArgumentException if required fields are null
     */
    public static TeamKanbanShare create(Long teamId, Long ownerUserId) {
        if (teamId == null) {
            throw new IllegalArgumentException("Team ID cannot be null");
        }
        if (ownerUserId == null) {
            throw new IllegalArgumentException("Owner user ID cannot be null");
        }
        
        TeamKanbanShare share = new TeamKanbanShare();
        share.teamId = teamId;
        share.ownerUserId = ownerUserId;
        share.sharedAt = LocalDateTime.now();
        share.unsharedAt = null; // Active by default
        share.createdAt = LocalDateTime.now();
        share.updatedAt = LocalDateTime.now();
        return share;
    }
    
    /**
     * Unshare the kanban board (soft delete)
     */
    public void unshare() {
        if (this.unsharedAt != null) {
            throw new IllegalStateException("Kanban board is already unshared");
        }
        this.unsharedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Check if the share is active
     * @return true if unsharedAt is null (active), false otherwise
     */
    public boolean isActive() {
        return this.unsharedAt == null;
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getTeamId() { return teamId; }
    public Long getOwnerUserId() { return ownerUserId; }
    public LocalDateTime getSharedAt() { return sharedAt; }
    public LocalDateTime getUnsharedAt() { return unsharedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    public void setOwnerUserId(Long ownerUserId) { this.ownerUserId = ownerUserId; }
    public void setSharedAt(LocalDateTime sharedAt) { this.sharedAt = sharedAt; }
    public void setUnsharedAt(LocalDateTime unsharedAt) { this.unsharedAt = unsharedAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

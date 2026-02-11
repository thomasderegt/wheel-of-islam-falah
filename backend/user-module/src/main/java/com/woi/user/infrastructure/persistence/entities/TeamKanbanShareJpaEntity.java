package com.woi.user.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for team_kanban_shares table
 */
@Entity
@Table(name = "team_kanban_shares", schema = "users", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"team_id", "owner_user_id"})
})
public class TeamKanbanShareJpaEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "team_id", nullable = false)
    private Long teamId;
    
    @Column(name = "owner_user_id", nullable = false)
    private Long ownerUserId;
    
    @Column(name = "shared_at", nullable = false)
    private LocalDateTime sharedAt;
    
    @Column(name = "unshared_at")
    private LocalDateTime unsharedAt;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    public TeamKanbanShareJpaEntity() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }
    
    public Long getOwnerUserId() { return ownerUserId; }
    public void setOwnerUserId(Long ownerUserId) { this.ownerUserId = ownerUserId; }
    
    public LocalDateTime getSharedAt() { return sharedAt; }
    public void setSharedAt(LocalDateTime sharedAt) { this.sharedAt = sharedAt; }
    
    public LocalDateTime getUnsharedAt() { return unsharedAt; }
    public void setUnsharedAt(LocalDateTime unsharedAt) { this.unsharedAt = unsharedAt; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

package com.woi.user.domain.entities;

import java.time.LocalDateTime;

/**
 * Team domain entity - Pure POJO (no JPA annotations)
 * 
 * Business rules:
 * - name is required
 * - ownerId is required (team creator)
 * - status defaults to ACTIVE
 */
public class Team {
    private Long id;
    private String name;
    private String description;
    private Long ownerId; // Required - FK to users.users
    private String status; // ACTIVE, ARCHIVED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Private constructor
    private Team() {}
    
    /**
     * Factory method: Create a new team
     * 
     * @param name Team name (required)
     * @param ownerId Team owner ID (required)
     * @return New Team instance with ACTIVE status
     * @throws IllegalArgumentException if name or ownerId is null/empty
     */
    public static Team create(String name, Long ownerId) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Team name cannot be null or empty");
        }
        if (ownerId == null) {
            throw new IllegalArgumentException("Owner ID cannot be null");
        }
        
        Team team = new Team();
        team.name = name.trim();
        team.ownerId = ownerId;
        team.status = "ACTIVE";
        team.createdAt = LocalDateTime.now();
        team.updatedAt = LocalDateTime.now();
        return team;
    }
    
    /**
     * Update team name
     */
    public void updateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Team name cannot be null or empty");
        }
        this.name = name.trim();
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Update team description
     */
    public void updateDescription(String description) {
        this.description = description;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Archive the team
     */
    public void archive() {
        this.status = "ARCHIVED";
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Activate the team
     */
    public void activate() {
        this.status = "ACTIVE";
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Long getOwnerId() { return ownerId; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    // Setters for mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public void setDescription(String description) { this.description = description; }
    public void setStatus(String status) { this.status = status; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

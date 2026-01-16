package com.woi.user.infrastructure.persistence.entities;

import com.woi.user.domain.enums.UserRole;
import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for UserRoleAssignment
 * Maps to database table users.user_role_assignments
 */
@Entity
@Table(name = "user_role_assignments", schema = "users")
public class UserRoleAssignmentJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private UserRole role;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Protected constructor - JPA requirement
    public UserRoleAssignmentJpaEntity() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


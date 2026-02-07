package com.woi.goalsokr.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * JPA entity for KeyResultProgress (database mapping)
 */
@Entity
@Table(name = "key_result_progress", schema = "goals_okr")
public class KeyResultProgressJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "key_result_id", nullable = false)
    private Long keyResultId; // FK to goals_okr.key_results

    @Column(name = "user_key_result_instance_id", nullable = false)
    private Long userKeyResultInstanceId; // FK to goals_okr.user_key_result_instances
    // userId is accessed via userKeyResultInstanceId → userObjectiveInstanceId → userGoalInstanceId → userId (strikt DDD)

    @Column(name = "current_value", precision = 10, scale = 2)
    private BigDecimal currentValue; // Can be null, must be >= 0 if set

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // Public constructor for JPA
    public KeyResultProgressJpaEntity() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getKeyResultId() { return keyResultId; }
    public void setKeyResultId(Long keyResultId) { this.keyResultId = keyResultId; }

    public Long getUserKeyResultInstanceId() { return userKeyResultInstanceId; }
    public void setUserKeyResultInstanceId(Long userKeyResultInstanceId) { this.userKeyResultInstanceId = userKeyResultInstanceId; }

    public BigDecimal getCurrentValue() { return currentValue; }
    public void setCurrentValue(BigDecimal currentValue) { this.currentValue = currentValue; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

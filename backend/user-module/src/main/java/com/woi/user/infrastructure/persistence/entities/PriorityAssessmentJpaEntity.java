package com.woi.user.infrastructure.persistence.entities;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * JPA entity for PriorityAssessment
 * Maps to database table users.priority_assessment
 */
@Entity
@Table(name = "priority_assessment", schema = "users")
public class PriorityAssessmentJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "falah_cycle_id")
    private Long falahCycleId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "scores_json", nullable = false, columnDefinition = "jsonb")
    private Map<String, Integer> scoresJson;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "skipped_wheels_json", nullable = false, columnDefinition = "jsonb")
    private List<String> skippedWheelsJson;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public PriorityAssessmentJpaEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getFalahCycleId() { return falahCycleId; }
    public void setFalahCycleId(Long falahCycleId) { this.falahCycleId = falahCycleId; }

    public Map<String, Integer> getScoresJson() { return scoresJson; }
    public void setScoresJson(Map<String, Integer> scoresJson) { this.scoresJson = scoresJson; }

    public List<String> getSkippedWheelsJson() { return skippedWheelsJson; }
    public void setSkippedWheelsJson(List<String> skippedWheelsJson) { this.skippedWheelsJson = skippedWheelsJson; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

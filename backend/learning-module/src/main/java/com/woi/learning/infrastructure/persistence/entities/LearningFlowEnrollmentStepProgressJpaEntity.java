package com.woi.learning.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for LearningFlowEnrollmentStepProgress (database mapping)
 */
@Entity
@Table(name = "learning_flow_step_progress", schema = "learning")
public class LearningFlowEnrollmentStepProgressJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "enrollment_id", nullable = false)
    private Long enrollmentId; // FK to learning_flow_enrollments
    
    @Column(name = "step_id", nullable = false)
    private Long stepId; // FK to learning_flow_steps
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private com.woi.learning.domain.enums.ProgressStatus status;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Public constructor for JPA
    public LearningFlowEnrollmentStepProgressJpaEntity() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getEnrollmentId() { return enrollmentId; }
    public void setEnrollmentId(Long enrollmentId) { this.enrollmentId = enrollmentId; }
    
    public Long getStepId() { return stepId; }
    public void setStepId(Long stepId) { this.stepId = stepId; }
    
    public com.woi.learning.domain.enums.ProgressStatus getStatus() { return status; }
    public void setStatus(com.woi.learning.domain.enums.ProgressStatus status) { this.status = status; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}


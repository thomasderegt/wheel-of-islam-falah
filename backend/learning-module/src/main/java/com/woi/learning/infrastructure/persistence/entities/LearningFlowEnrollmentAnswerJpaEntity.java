package com.woi.learning.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for LearningFlowEnrollmentAnswer (database mapping)
 */
@Entity
@Table(name = "learning_flow_answers", schema = "learning")
public class LearningFlowEnrollmentAnswerJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "enrollment_id", nullable = false)
    private Long enrollmentId; // FK to learning_flow_enrollments
    
    @Column(name = "step_id", nullable = false)
    private Long stepId; // FK to learning_flow_steps
    
    @Enumerated(EnumType.STRING)
    @Column(name = "answer_type", nullable = false, length = 50)
    private com.woi.learning.domain.enums.AnswerType answerType;
    
    @Column(name = "answer_text", columnDefinition = "TEXT", nullable = false)
    private String answerText;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Public constructor for JPA
    public LearningFlowEnrollmentAnswerJpaEntity() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getEnrollmentId() { return enrollmentId; }
    public void setEnrollmentId(Long enrollmentId) { this.enrollmentId = enrollmentId; }
    
    public Long getStepId() { return stepId; }
    public void setStepId(Long stepId) { this.stepId = stepId; }
    
    public com.woi.learning.domain.enums.AnswerType getAnswerType() { return answerType; }
    public void setAnswerType(com.woi.learning.domain.enums.AnswerType answerType) { this.answerType = answerType; }
    
    public String getAnswerText() { return answerText; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


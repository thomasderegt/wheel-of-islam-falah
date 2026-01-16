package com.woi.learning.domain.entities;

import com.woi.learning.domain.enums.AnswerType;
import java.time.LocalDateTime;

/**
 * LearningFlowEnrollmentAnswer domain entity - Pure POJO (no JPA annotations)
 * 
 * Represents a user answer to a learning flow step.
 * Answers are append-only (no updates, only new answers).
 * 
 * Business rules:
 * - enrollmentId is required
 * - stepId is required
 * - type is required (PICTURE_QUESTION or REFLECTION)
 * - answerText is required
 * - Multiple answers per step are allowed
 */
public class LearningFlowEnrollmentAnswer {
    private Long id;
    private Long enrollmentId; // Required - FK to LearningFlowEnrollment
    private Long stepId; // Required - FK to LearningFlowStep
    private AnswerType type; // Required - PICTURE_QUESTION or REFLECTION
    private String answerText; // Required
    private LocalDateTime createdAt;
    
    // Public constructor for mappers (infrastructure layer)
    public LearningFlowEnrollmentAnswer() {}
    
    /**
     * Factory method: Create a new answer
     * 
     * @param enrollmentId Enrollment ID (required)
     * @param stepId Step ID (required)
     * @param type Answer type (required)
     * @param answerText Answer text (required)
     * @return New LearningFlowEnrollmentAnswer instance
     * @throws IllegalArgumentException if required fields are null or empty
     */
    public static LearningFlowEnrollmentAnswer create(Long enrollmentId, Long stepId, AnswerType type, String answerText) {
        if (enrollmentId == null) {
            throw new IllegalArgumentException("EnrollmentId cannot be null");
        }
        if (stepId == null) {
            throw new IllegalArgumentException("StepId cannot be null");
        }
        if (type == null) {
            throw new IllegalArgumentException("AnswerType cannot be null");
        }
        if (answerText == null || answerText.trim().isEmpty()) {
            throw new IllegalArgumentException("AnswerText cannot be null or empty");
        }
        
        LearningFlowEnrollmentAnswer answer = new LearningFlowEnrollmentAnswer();
        answer.enrollmentId = enrollmentId;
        answer.stepId = stepId;
        answer.type = type;
        answer.answerText = answerText;
        answer.createdAt = LocalDateTime.now();
        return answer;
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getEnrollmentId() { return enrollmentId; }
    public Long getStepId() { return stepId; }
    public AnswerType getType() { return type; }
    public String getAnswerText() { return answerText; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    
    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setEnrollmentId(Long enrollmentId) { this.enrollmentId = enrollmentId; }
    public void setStepId(Long stepId) { this.stepId = stepId; }
    public void setType(AnswerType type) { this.type = type; }
    public void setAnswerText(String answerText) { this.answerText = answerText; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


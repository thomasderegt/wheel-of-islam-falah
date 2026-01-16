package com.woi.learning.application.results;

import com.woi.learning.domain.enums.AnswerType;
import java.time.LocalDateTime;

/**
 * Result DTO for EnrollmentAnswer operations
 */
public record EnrollmentAnswerResult(
    Long id,
    Long enrollmentId,
    Long stepId,
    AnswerType type,
    String answerText,
    LocalDateTime createdAt
) {
    public static EnrollmentAnswerResult from(com.woi.learning.domain.entities.LearningFlowEnrollmentAnswer answer) {
        return new EnrollmentAnswerResult(
            answer.getId(),
            answer.getEnrollmentId(),
            answer.getStepId(),
            answer.getType(),
            answer.getAnswerText(),
            answer.getCreatedAt()
        );
    }
}


package com.woi.learning.infrastructure.web.dtos;

import com.woi.learning.api.AnswerType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for adding an answer to a learning flow step
 */
public record AddAnswerRequest(
    @NotNull(message = "EnrollmentId is required")
    Long enrollmentId,
    
    @NotNull(message = "StepId is required")
    Long stepId,
    
    @NotNull(message = "AnswerType is required")
    AnswerType type,
    
    @NotBlank(message = "AnswerText is required")
    String answerText
) {
}


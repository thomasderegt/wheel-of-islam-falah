package com.woi.learning.infrastructure.web.dtos;

import com.woi.learning.api.ProgressStatus;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for updating progress for a learning flow step
 */
public record UpdateProgressRequest(
    @NotNull(message = "EnrollmentId is required")
    Long enrollmentId,
    
    @NotNull(message = "StepId is required")
    Long stepId,
    
    @NotNull(message = "ProgressStatus is required")
    ProgressStatus status
) {
}


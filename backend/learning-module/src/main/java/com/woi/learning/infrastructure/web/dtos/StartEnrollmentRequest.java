package com.woi.learning.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for starting a learning flow enrollment
 */
public record StartEnrollmentRequest(
    @NotNull(message = "UserId is required")
    Long userId,
    
    @NotNull(message = "TemplateId is required")
    Long templateId,
    
    @NotNull(message = "SectionId is required")
    Long sectionId
) {
}


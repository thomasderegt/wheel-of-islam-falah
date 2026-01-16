package com.woi.learning.infrastructure.web.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for creating a learning flow step
 * Note: templateId comes from the path variable, not from the request body
 */
public record CreateStepRequest(
    @NotNull(message = "ParagraphId is required")
    Long paragraphId,
    
    @NotNull(message = "OrderIndex is required")
    @Min(value = 0, message = "OrderIndex must be non-negative")
    Integer orderIndex,
    
    @NotBlank(message = "QuestionText is required")
    String questionText
) {
}


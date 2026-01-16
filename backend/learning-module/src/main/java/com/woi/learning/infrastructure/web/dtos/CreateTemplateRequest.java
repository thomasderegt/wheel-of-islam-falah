package com.woi.learning.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for creating a learning flow template
 */
public record CreateTemplateRequest(
    @NotBlank(message = "Name is required")
    String name,
    
    String description,
    
    @NotNull(message = "SectionId is required")
    Long sectionId,
    
    @NotNull(message = "CreatedBy is required")
    Long createdBy
) {
}


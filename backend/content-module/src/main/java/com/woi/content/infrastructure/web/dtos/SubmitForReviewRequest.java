package com.woi.content.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for submitting content for review
 */
public record SubmitForReviewRequest(
    @NotNull(message = "Type is required")
    String type,  // SECTION, PARAGRAPH, CHAPTER, BOOK
    
    @NotNull(message = "Reference ID is required")
    Long referenceId,
    
    @NotNull(message = "Version ID is required")
    Long versionId,
    
    @NotNull(message = "Submitted by (user ID) is required")
    Long submittedBy,
    
    String comment
) {}


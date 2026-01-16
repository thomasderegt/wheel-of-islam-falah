package com.woi.content.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for approving a review
 */
public record ApproveReviewRequest(
    @NotNull(message = "Reviewed by (user ID) is required")
    Long reviewedBy,
    
    String comment
) {}


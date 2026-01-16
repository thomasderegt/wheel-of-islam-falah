package com.woi.content.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Request DTO for rejecting a review
 */
public record RejectReviewRequest(
    @NotNull(message = "Reviewed by (user ID) is required")
    Long reviewedBy,
    
    @NotBlank(message = "Comment is required for rejection")
    String comment
) {}


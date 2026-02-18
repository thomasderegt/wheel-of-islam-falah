package com.woi.goalsokr.infrastructure.web.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

/**
 * Request DTO for creating an initiative
 */
public record CreateInitiativeRequest(
    @NotNull(message = "User ID is required")
    Long userId,
    
    Long keyResultId, // Optional - template reference for context/filtering
    
    @NotNull(message = "User Key Result Instance ID is required")
    Long userKeyResultInstanceId,
    
    @NotBlank(message = "Title is required")
    String title,
    
    String description,
    LocalDate targetDate,
    Long learningFlowEnrollmentId
) {}

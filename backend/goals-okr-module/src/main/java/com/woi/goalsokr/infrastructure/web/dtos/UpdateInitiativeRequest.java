package com.woi.goalsokr.infrastructure.web.dtos;

import java.time.LocalDate;

/**
 * Request DTO for updating an initiative
 */
public record UpdateInitiativeRequest(
    String title,
    String description,
    LocalDate targetDate
) {}

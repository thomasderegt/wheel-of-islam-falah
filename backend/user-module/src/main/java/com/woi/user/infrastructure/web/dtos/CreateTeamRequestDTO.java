package com.woi.user.infrastructure.web.dtos;

/**
 * DTO for creating a team
 */
public record CreateTeamRequestDTO(
    String name,
    String description
) {}

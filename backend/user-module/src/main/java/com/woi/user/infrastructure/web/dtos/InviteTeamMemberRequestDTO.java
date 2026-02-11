package com.woi.user.infrastructure.web.dtos;

/**
 * DTO for inviting a team member
 */
public record InviteTeamMemberRequestDTO(
    String email,
    String role
) {}

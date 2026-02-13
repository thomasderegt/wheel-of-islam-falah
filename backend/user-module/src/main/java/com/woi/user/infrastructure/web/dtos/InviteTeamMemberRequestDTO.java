package com.woi.user.infrastructure.web.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * DTO for inviting a team member
 */
public record InviteTeamMemberRequestDTO(
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,
    
    @Pattern(regexp = "OWNER|ADMIN|MEMBER", message = "Role must be OWNER, ADMIN, or MEMBER")
    String role
) {}

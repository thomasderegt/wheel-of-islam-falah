package com.woi.user.application.results;

import com.woi.user.domain.entities.Team;
import java.time.LocalDateTime;

/**
 * Result DTO for team operations
 */
public record TeamResult(
    Long id,
    String name,
    String description,
    Long ownerId,
    String status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    public static TeamResult from(Team team) {
        return new TeamResult(
            team.getId(),
            team.getName(),
            team.getDescription(),
            team.getOwnerId(),
            team.getStatus(),
            team.getCreatedAt(),
            team.getUpdatedAt()
        );
    }
}

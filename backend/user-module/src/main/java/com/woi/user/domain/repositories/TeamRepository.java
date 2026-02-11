package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.Team;
import java.util.List;
import java.util.Optional;

/**
 * Team repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface TeamRepository {
    Optional<Team> findById(Long id);
    List<Team> findByOwnerId(Long ownerId);
    List<Team> findByUserId(Long userId); // Teams where user is a member
    Team save(Team team);
    void delete(Team team);
}

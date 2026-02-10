package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.UserPreference;
import java.util.Optional;

/**
 * UserPreference repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface UserPreferenceRepository {
    Optional<UserPreference> findByUserId(Long userId);
    UserPreference save(UserPreference userPreference);
    void delete(UserPreference userPreference);
}

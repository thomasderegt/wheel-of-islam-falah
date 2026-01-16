package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.User;
import java.util.Optional;

/**
 * User repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface UserRepository {
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    User save(User user);
    void delete(User user);
}


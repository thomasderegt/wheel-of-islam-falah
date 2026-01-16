package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.UserRoleAssignment;
import com.woi.user.domain.enums.UserRole;
import java.util.List;
import java.util.Optional;

/**
 * UserRoleAssignment repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface UserRoleAssignmentRepository {
    Optional<UserRoleAssignment> findById(Long id);
    List<UserRoleAssignment> findByUserId(Long userId);
    Optional<UserRoleAssignment> findByUserIdAndRole(Long userId, UserRole role);
    boolean existsByUserIdAndRole(Long userId, UserRole role);
    UserRoleAssignment save(UserRoleAssignment assignment);
    void delete(UserRoleAssignment assignment);
    void deleteByUserIdAndRole(Long userId, UserRole role);
    void deleteByUserId(Long userId);
}


package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.enums.UserRole;
import com.woi.user.infrastructure.persistence.entities.UserRoleAssignmentJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for UserRoleAssignmentJpaEntity
 */
@Repository
public interface UserRoleAssignmentJpaRepository extends JpaRepository<UserRoleAssignmentJpaEntity, Long> {
    List<UserRoleAssignmentJpaEntity> findByUserId(Long userId);
    Optional<UserRoleAssignmentJpaEntity> findByUserIdAndRole(Long userId, UserRole role);
    boolean existsByUserIdAndRole(Long userId, UserRole role);
    void deleteByUserIdAndRole(Long userId, UserRole role);
    void deleteByUserId(Long userId);
}


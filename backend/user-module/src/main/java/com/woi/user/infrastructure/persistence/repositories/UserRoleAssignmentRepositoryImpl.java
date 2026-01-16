package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.UserRoleAssignment;
import com.woi.user.domain.enums.UserRole;
import com.woi.user.domain.repositories.UserRoleAssignmentRepository;
import com.woi.user.infrastructure.persistence.entities.UserRoleAssignmentJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.UserRoleAssignmentEntityMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for UserRoleAssignment
 */
@Repository
public class UserRoleAssignmentRepositoryImpl implements UserRoleAssignmentRepository {
    private final UserRoleAssignmentJpaRepository jpaRepository;
    private final UserRoleAssignmentEntityMapper mapper;
    
    public UserRoleAssignmentRepositoryImpl(UserRoleAssignmentJpaRepository jpaRepository, UserRoleAssignmentEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    public Optional<UserRoleAssignment> findById(Long id) {
        return jpaRepository.findById(id)
            .map(mapper::toDomain);
    }
    
    @Override
    public List<UserRoleAssignment> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    public Optional<UserRoleAssignment> findByUserIdAndRole(Long userId, UserRole role) {
        return jpaRepository.findByUserIdAndRole(userId, role)
            .map(mapper::toDomain);
    }
    
    @Override
    public boolean existsByUserIdAndRole(Long userId, UserRole role) {
        return jpaRepository.existsByUserIdAndRole(userId, role);
    }
    
    @Override
    public UserRoleAssignment save(UserRoleAssignment assignment) {
        UserRoleAssignmentJpaEntity jpaEntity = mapper.toJpa(assignment);
        UserRoleAssignmentJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomain(saved);
    }
    
    @Override
    public void delete(UserRoleAssignment assignment) {
        jpaRepository.deleteById(assignment.getId());
    }
    
    @Override
    public void deleteByUserIdAndRole(Long userId, UserRole role) {
        jpaRepository.deleteByUserIdAndRole(userId, role);
    }
    
    @Override
    public void deleteByUserId(Long userId) {
        jpaRepository.deleteByUserId(userId);
    }
}


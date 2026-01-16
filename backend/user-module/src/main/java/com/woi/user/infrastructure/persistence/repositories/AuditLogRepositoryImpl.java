package com.woi.user.infrastructure.persistence.repositories;

import com.woi.user.domain.entities.AuditLog;
import com.woi.user.domain.repositories.AuditLogRepository;
import com.woi.user.infrastructure.persistence.entities.AuditLogJpaEntity;
import com.woi.user.infrastructure.persistence.mappers.AuditLogEntityMapper;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Repository implementation for AuditLog
 */
@Repository
public class AuditLogRepositoryImpl implements AuditLogRepository {
    private final AuditLogJpaRepository jpaRepository;
    private final AuditLogEntityMapper mapper;
    
    public AuditLogRepositoryImpl(AuditLogJpaRepository jpaRepository, AuditLogEntityMapper mapper) {
        this.jpaRepository = jpaRepository;
        this.mapper = mapper;
    }
    
    @Override
    public AuditLog save(AuditLog auditLog) {
        AuditLogJpaEntity jpaEntity = mapper.toJpa(auditLog);
        AuditLogJpaEntity saved = jpaRepository.save(jpaEntity);
        return mapper.toDomain(saved);
    }
    
    @Override
    public List<AuditLog> findByUserIdOrderByCreatedAtDesc(Long userId) {
        return jpaRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<AuditLog> findByEventTypeOrderByCreatedAtDesc(AuditLog.EventType eventType) {
        // Map domain EventType to JPA EventType
        AuditLogJpaEntity.EventType jpaEventType = AuditLogJpaEntity.EventType.valueOf(eventType.name());
        return jpaRepository.findByEventTypeOrderByCreatedAtDesc(jpaEventType).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    public List<AuditLog> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end) {
        return jpaRepository.findByCreatedAtBetweenOrderByCreatedAtDesc(start, end).stream()
            .map(mapper::toDomain)
            .collect(Collectors.toList());
    }
}


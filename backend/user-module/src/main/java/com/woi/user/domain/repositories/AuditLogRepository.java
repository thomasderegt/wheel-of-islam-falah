package com.woi.user.domain.repositories;

import com.woi.user.domain.entities.AuditLog;
import java.time.LocalDateTime;
import java.util.List;

/**
 * AuditLog repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface AuditLogRepository {
    AuditLog save(AuditLog auditLog);
    List<AuditLog> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<AuditLog> findByEventTypeOrderByCreatedAtDesc(AuditLog.EventType eventType);
    List<AuditLog> findByCreatedAtBetweenOrderByCreatedAtDesc(LocalDateTime start, LocalDateTime end);
}


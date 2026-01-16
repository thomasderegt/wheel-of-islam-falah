package com.woi.user.infrastructure.persistence.mappers;

import com.woi.user.domain.entities.AuditLog;
import com.woi.user.infrastructure.persistence.entities.AuditLogJpaEntity;
import org.springframework.stereotype.Component;

/**
 * Mapper between AuditLog domain entity and AuditLogJpaEntity
 */
@Component
public class AuditLogEntityMapper {
    
    public AuditLog toDomain(AuditLogJpaEntity jpa) {
        if (jpa == null) return null;
        
        // Map EventType and EventStatus enums
        AuditLog.EventType eventType = mapEventType(jpa.getEventType());
        AuditLog.EventStatus eventStatus = mapEventStatus(jpa.getEventStatus());
        
        AuditLog log = AuditLog.create(
            jpa.getUserId(),
            eventType,
            eventStatus,
            jpa.getIpAddress(),
            jpa.getUserAgent(),
            jpa.getDetails()
        );
        log.setId(jpa.getId());
        log.setCreatedAt(jpa.getCreatedAt());
        return log;
    }
    
    public AuditLogJpaEntity toJpa(AuditLog domain) {
        if (domain == null) return null;
        
        AuditLogJpaEntity jpa = new AuditLogJpaEntity();
        jpa.setId(domain.getId());
        jpa.setUserId(domain.getUserId());
        jpa.setEventType(mapEventType(domain.getEventType()));
        jpa.setEventStatus(mapEventStatus(domain.getEventStatus()));
        jpa.setIpAddress(domain.getIpAddress());
        jpa.setUserAgent(domain.getUserAgent());
        jpa.setDetails(domain.getDetails());
        jpa.setCreatedAt(domain.getCreatedAt());
        return jpa;
    }
    
    private AuditLog.EventType mapEventType(AuditLogJpaEntity.EventType jpaType) {
        if (jpaType == null) return null;
        return AuditLog.EventType.valueOf(jpaType.name());
    }
    
    private AuditLogJpaEntity.EventType mapEventType(AuditLog.EventType domainType) {
        if (domainType == null) return null;
        return AuditLogJpaEntity.EventType.valueOf(domainType.name());
    }
    
    private AuditLog.EventStatus mapEventStatus(AuditLogJpaEntity.EventStatus jpaStatus) {
        if (jpaStatus == null) return null;
        return AuditLog.EventStatus.valueOf(jpaStatus.name());
    }
    
    private AuditLogJpaEntity.EventStatus mapEventStatus(AuditLog.EventStatus domainStatus) {
        if (domainStatus == null) return null;
        return AuditLogJpaEntity.EventStatus.valueOf(domainStatus.name());
    }
}


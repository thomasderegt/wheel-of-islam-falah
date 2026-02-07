package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.Wheel;
import com.woi.goalsokr.infrastructure.persistence.entities.WheelJpaEntity;

/**
 * Mapper between Wheel domain entity and WheelJpaEntity
 */
public class WheelEntityMapper {
    
    /**
     * Convert JPA entity to domain entity
     */
    public static Wheel toDomain(WheelJpaEntity jpa) {
        if (jpa == null) {
            return null;
        }
        
        Wheel domain = new Wheel();
        domain.setId(jpa.getId());
        domain.setWheelKey(jpa.getWheelKey());
        domain.setNameNl(jpa.getNameNl());
        domain.setNameEn(jpa.getNameEn());
        domain.setDescriptionNl(jpa.getDescriptionNl());
        domain.setDescriptionEn(jpa.getDescriptionEn());
        domain.setDisplayOrder(jpa.getDisplayOrder());
        domain.setCreatedAt(jpa.getCreatedAt());
        return domain;
    }
    
    /**
     * Convert domain entity to JPA entity
     */
    public static WheelJpaEntity toJpa(Wheel domain) {
        if (domain == null) {
            return null;
        }
        
        WheelJpaEntity jpa = new WheelJpaEntity();
        jpa.setId(domain.getId());
        jpa.setWheelKey(domain.getWheelKey());
        jpa.setNameNl(domain.getNameNl());
        jpa.setNameEn(domain.getNameEn());
        jpa.setDescriptionNl(domain.getDescriptionNl());
        jpa.setDescriptionEn(domain.getDescriptionEn());
        jpa.setDisplayOrder(domain.getDisplayOrder());
        jpa.setCreatedAt(domain.getCreatedAt());
        return jpa;
    }
}

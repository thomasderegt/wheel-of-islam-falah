package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.LifeDomain;
import com.woi.goalsokr.domain.enums.LifeDomainType;
import com.woi.goalsokr.infrastructure.persistence.entities.LifeDomainJpaEntity;

/**
 * Mapper between LifeDomain domain entity and LifeDomainJpaEntity
 */
public class LifeDomainEntityMapper {
    
    /**
     * Convert JPA entity to domain entity
     */
    public static LifeDomain toDomain(LifeDomainJpaEntity jpa) {
        if (jpa == null) {
            return null;
        }
        
        // Parse domain_key to enum; explicit handling for Wheel of Success (FIQH, TAZKIYYAH, FALAH)
        String key = jpa.getDomainKey();
        LifeDomainType domainKey;
        if ("FIQH".equals(key)) {
            domainKey = LifeDomainType.FIQH;
        } else if ("TAZKIYYAH".equals(key)) {
            domainKey = LifeDomainType.TAZKIYYAH;
        } else if ("FALAH".equals(key)) {
            domainKey = LifeDomainType.FALAH;
        } else {
            try {
                domainKey = LifeDomainType.valueOf(key);
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
        
        LifeDomain domain = new LifeDomain();
        domain.setId(jpa.getId());
        domain.setDomainKey(domainKey);
        domain.setTitleNl(jpa.getTitleNl());
        domain.setTitleEn(jpa.getTitleEn());
        domain.setDescriptionNl(jpa.getDescriptionNl());
        domain.setDescriptionEn(jpa.getDescriptionEn());
        domain.setIconName(jpa.getIconName());
        domain.setDisplayOrder(jpa.getDisplayOrder());
        domain.setWheelId(jpa.getWheelId());
        domain.setCreatedAt(jpa.getCreatedAt());
        return domain;
    }
    
    /**
     * Convert domain entity to JPA entity
     */
    public static LifeDomainJpaEntity toJpa(LifeDomain domain) {
        if (domain == null) {
            return null;
        }
        
        LifeDomainJpaEntity jpa = new LifeDomainJpaEntity();
        jpa.setId(domain.getId());
        jpa.setDomainKey(domain.getDomainKey().name());
        jpa.setTitleNl(domain.getTitleNl());
        jpa.setTitleEn(domain.getTitleEn());
        jpa.setDescriptionNl(domain.getDescriptionNl());
        jpa.setDescriptionEn(domain.getDescriptionEn());
        jpa.setIconName(domain.getIconName());
        jpa.setDisplayOrder(domain.getDisplayOrder());
        jpa.setWheelId(domain.getWheelId());
        jpa.setCreatedAt(domain.getCreatedAt());
        return jpa;
    }
}

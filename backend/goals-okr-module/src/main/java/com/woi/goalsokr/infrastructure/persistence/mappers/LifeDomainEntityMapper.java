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
        
        LifeDomain domain = new LifeDomain();
        domain.setId(jpa.getId());
        domain.setDomainKey(LifeDomainType.valueOf(jpa.getDomainKey()));
        domain.setTitleNl(jpa.getTitleNl());
        domain.setTitleEn(jpa.getTitleEn());
        domain.setDescriptionNl(jpa.getDescriptionNl());
        domain.setDescriptionEn(jpa.getDescriptionEn());
        domain.setIconName(jpa.getIconName());
        domain.setDisplayOrder(jpa.getDisplayOrder());
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
        jpa.setCreatedAt(domain.getCreatedAt());
        return jpa;
    }
}

package com.woi.goalsokr.infrastructure.persistence.mappers;

import com.woi.goalsokr.domain.entities.KanbanItem;
import com.woi.goalsokr.domain.enums.ItemType;
import com.woi.goalsokr.domain.enums.KanbanColumn;
import com.woi.goalsokr.infrastructure.persistence.entities.KanbanItemJpaEntity;

/**
 * Mapper between KanbanItem domain entity and KanbanItemJpaEntity
 */
public class KanbanItemEntityMapper {

    public static KanbanItem toDomain(KanbanItemJpaEntity jpaEntity) {
        if (jpaEntity == null) {
            return null;
        }

        KanbanItem domain = new KanbanItem();
        domain.setId(jpaEntity.getId());
        domain.setUserId(jpaEntity.getUserId());
        domain.setItemType(ItemType.valueOf(jpaEntity.getItemType()));
        domain.setItemId(jpaEntity.getItemId());
        domain.setColumnName(KanbanColumn.valueOf(jpaEntity.getColumnName()));
        domain.setPosition(jpaEntity.getPosition());
        domain.setNotes(jpaEntity.getNotes());
        domain.setNumber(jpaEntity.getNumber());
        domain.setCreatedAt(jpaEntity.getCreatedAt());
        domain.setUpdatedAt(jpaEntity.getUpdatedAt());

        return domain;
    }

    public static KanbanItemJpaEntity toJpa(KanbanItem domain) {
        if (domain == null) {
            return null;
        }

        KanbanItemJpaEntity jpaEntity = new KanbanItemJpaEntity();
        jpaEntity.setId(domain.getId());
        jpaEntity.setUserId(domain.getUserId());
        jpaEntity.setItemType(domain.getItemType().name());
        jpaEntity.setItemId(domain.getItemId());
        jpaEntity.setColumnName(domain.getColumnName().name());
        jpaEntity.setPosition(domain.getPosition());
        jpaEntity.setNotes(domain.getNotes());
        jpaEntity.setNumber(domain.getNumber());
        jpaEntity.setCreatedAt(domain.getCreatedAt());
        jpaEntity.setUpdatedAt(domain.getUpdatedAt());

        return jpaEntity;
    }
}

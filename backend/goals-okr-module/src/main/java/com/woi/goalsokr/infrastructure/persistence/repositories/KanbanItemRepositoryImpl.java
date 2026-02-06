package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.KanbanItem;
import com.woi.goalsokr.domain.enums.ItemType;
import com.woi.goalsokr.domain.enums.KanbanColumn;
import com.woi.goalsokr.domain.repositories.KanbanItemRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.KanbanItemJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.KanbanItemEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for KanbanItem
 */
@Repository
public class KanbanItemRepositoryImpl implements KanbanItemRepository {

    private final KanbanItemJpaRepository jpaRepository;

    public KanbanItemRepositoryImpl(KanbanItemJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<KanbanItem> findById(Long id) {
        return jpaRepository.findById(id)
            .map(KanbanItemEntityMapper::toDomain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<KanbanItem> findByUserId(Long userId) {
        return jpaRepository.findByUserId(userId).stream()
            .map(KanbanItemEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<KanbanItem> findByUserIdAndColumn(Long userId, KanbanColumn column) {
        return jpaRepository.findByUserIdAndColumnName(userId, column.name()).stream()
            .map(KanbanItemEntityMapper::toDomain)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<KanbanItem> findByUserIdAndItemTypeAndItemId(Long userId, ItemType itemType, Long itemId) {
        return jpaRepository.findByUserIdAndItemTypeAndItemId(userId, itemType.name(), itemId)
            .map(KanbanItemEntityMapper::toDomain);
    }

    @Override
    @Transactional
    public KanbanItem save(KanbanItem item) {
        KanbanItemJpaEntity jpaEntity = KanbanItemEntityMapper.toJpa(item);
        KanbanItemJpaEntity saved = jpaRepository.save(jpaEntity);
        return KanbanItemEntityMapper.toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(KanbanItem item) {
        jpaRepository.deleteById(item.getId());
    }

    @Override
    @Transactional
    public void updatePosition(Long id, KanbanColumn column, Integer position) {
        KanbanItemJpaEntity entity = jpaRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("KanbanItem not found with id: " + id));
        entity.setColumnName(column.name());
        entity.setPosition(position);
        entity.setUpdatedAt(java.time.LocalDateTime.now());
        jpaRepository.save(entity);
    }
}

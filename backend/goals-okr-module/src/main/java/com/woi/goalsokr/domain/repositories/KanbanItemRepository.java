package com.woi.goalsokr.domain.repositories;

import com.woi.goalsokr.domain.entities.KanbanItem;
import com.woi.goalsokr.domain.enums.KanbanColumn;

import java.util.List;
import java.util.Optional;

/**
 * KanbanItem repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface KanbanItemRepository {
    Optional<KanbanItem> findById(Long id);
    List<KanbanItem> findByUserId(Long userId);
    List<KanbanItem> findByUserIdAndColumn(Long userId, KanbanColumn column);
    Optional<KanbanItem> findByUserIdAndItemTypeAndItemId(Long userId, com.woi.goalsokr.domain.enums.ItemType itemType, Long itemId);
    KanbanItem save(KanbanItem item);
    void delete(KanbanItem item);
    void updatePosition(Long id, KanbanColumn column, Integer position);
}

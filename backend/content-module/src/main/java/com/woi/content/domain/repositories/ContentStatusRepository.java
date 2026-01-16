package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.ContentStatus;
import com.woi.content.domain.enums.ContentStatusType;

import java.util.Optional;

/**
 * ContentStatus repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface ContentStatusRepository {
    Optional<ContentStatus> findByEntityTypeAndEntityId(String entityType, Long entityId);
    ContentStatus save(ContentStatus contentStatus);
    void delete(ContentStatus contentStatus);
}


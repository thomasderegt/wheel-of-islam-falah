package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.KanbanItemJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for KanbanItemJpaEntity
 */
@Repository
public interface KanbanItemJpaRepository extends JpaRepository<KanbanItemJpaEntity, Long> {
    List<KanbanItemJpaEntity> findByUserId(Long userId);

    @Query("SELECT k FROM KanbanItemJpaEntity k WHERE k.userId = :userId AND k.columnName = :columnName ORDER BY k.position ASC")
    List<KanbanItemJpaEntity> findByUserIdAndColumnName(@Param("userId") Long userId, @Param("columnName") String columnName);

    @Query("SELECT k FROM KanbanItemJpaEntity k WHERE k.userId = :userId AND k.itemType = :itemType AND k.itemId = :itemId")
    Optional<KanbanItemJpaEntity> findByUserIdAndItemTypeAndItemId(
        @Param("userId") Long userId,
        @Param("itemType") String itemType,
        @Param("itemId") Long itemId
    );
}

package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.infrastructure.persistence.entities.CategoryJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for CategoryJpaEntity
 */
@Repository
public interface CategoryJpaRepository extends JpaRepository<CategoryJpaEntity, Long> {
    Optional<CategoryJpaEntity> findByCategoryNumber(Integer categoryNumber);
    List<CategoryJpaEntity> findByWheelId(Long wheelId);
}


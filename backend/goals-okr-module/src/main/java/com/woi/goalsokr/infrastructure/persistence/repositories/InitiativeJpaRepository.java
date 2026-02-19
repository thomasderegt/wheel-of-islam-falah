package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.InitiativeJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for InitiativeJpaEntity (template)
 */
@Repository
public interface InitiativeJpaRepository extends JpaRepository<InitiativeJpaEntity, Long> {
    List<InitiativeJpaEntity> findByKeyResultIdOrderByDisplayOrderAsc(Long keyResultId);
    List<InitiativeJpaEntity> findByCreatedByUserIdOrderByCreatedAtDesc(Long createdByUserId);
}

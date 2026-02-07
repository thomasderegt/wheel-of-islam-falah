package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.infrastructure.persistence.entities.InitiativeSuggestionJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for InitiativeSuggestionJpaEntity
 */
@Repository
public interface InitiativeSuggestionJpaRepository extends JpaRepository<InitiativeSuggestionJpaEntity, Long> {
    List<InitiativeSuggestionJpaEntity> findByKeyResultIdOrderByDisplayOrderAsc(Long keyResultId);
}

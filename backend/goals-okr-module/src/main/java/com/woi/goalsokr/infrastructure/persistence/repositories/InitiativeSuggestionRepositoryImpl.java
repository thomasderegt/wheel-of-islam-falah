package com.woi.goalsokr.infrastructure.persistence.repositories;

import com.woi.goalsokr.domain.entities.InitiativeSuggestion;
import com.woi.goalsokr.domain.repositories.InitiativeSuggestionRepository;
import com.woi.goalsokr.infrastructure.persistence.entities.InitiativeSuggestionJpaEntity;
import com.woi.goalsokr.infrastructure.persistence.mappers.InitiativeSuggestionEntityMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Implementation of InitiativeSuggestionRepository using Spring Data JPA
 */
@Component
public class InitiativeSuggestionRepositoryImpl implements InitiativeSuggestionRepository {
    private final InitiativeSuggestionJpaRepository jpaRepository;

    public InitiativeSuggestionRepositoryImpl(InitiativeSuggestionJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public Optional<InitiativeSuggestion> findById(Long id) {
        return jpaRepository.findById(id)
                .map(InitiativeSuggestionEntityMapper::toDomain);
    }

    @Override
    public List<InitiativeSuggestion> findByKeyResultId(Long keyResultId) {
        return jpaRepository.findByKeyResultIdOrderByDisplayOrderAsc(keyResultId)
                .stream()
                .map(InitiativeSuggestionEntityMapper::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public InitiativeSuggestion save(InitiativeSuggestion suggestion) {
        InitiativeSuggestionJpaEntity jpaEntity = InitiativeSuggestionEntityMapper.toJpa(suggestion);
        InitiativeSuggestionJpaEntity saved = jpaRepository.save(jpaEntity);
        return InitiativeSuggestionEntityMapper.toDomain(saved);
    }

    @Override
    public void delete(Long id) {
        jpaRepository.deleteById(id);
    }
}

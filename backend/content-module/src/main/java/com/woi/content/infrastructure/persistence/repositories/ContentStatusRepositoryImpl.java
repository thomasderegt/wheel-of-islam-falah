package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.ContentStatus;
import com.woi.content.domain.repositories.ContentStatusRepository;
import com.woi.content.infrastructure.persistence.entities.ContentStatusJpaEntity;
import com.woi.content.infrastructure.persistence.mappers.ContentStatusEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Repository implementation for ContentStatus
 */
@Repository
public class ContentStatusRepositoryImpl implements ContentStatusRepository {
    
    private final ContentStatusJpaRepository jpaRepository;
    
    public ContentStatusRepositoryImpl(ContentStatusJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<ContentStatus> findByEntityTypeAndEntityId(String entityType, Long entityId) {
        return jpaRepository.findByEntityTypeAndEntityId(entityType, entityId)
            .map(ContentStatusEntityMapper::toDomain);
    }
    
    @Override
    @Transactional
    public ContentStatus save(ContentStatus contentStatus) {
        ContentStatusJpaEntity jpaEntity = ContentStatusEntityMapper.toJpa(contentStatus);
        ContentStatusJpaEntity saved = jpaRepository.save(jpaEntity);
        return ContentStatusEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(ContentStatus contentStatus) {
        jpaRepository.deleteById(contentStatus.getId());
    }
}


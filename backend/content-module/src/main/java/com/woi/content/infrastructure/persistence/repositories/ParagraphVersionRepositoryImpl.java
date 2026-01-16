package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.ParagraphVersion;
import com.woi.content.domain.repositories.ParagraphVersionRepository;
import com.woi.content.infrastructure.persistence.entities.ParagraphVersionJpaEntity;
import com.woi.content.infrastructure.persistence.mappers.ParagraphVersionEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for ParagraphVersion
 */
@Repository
public class ParagraphVersionRepositoryImpl implements ParagraphVersionRepository {
    
    private final ParagraphVersionJpaRepository jpaRepository;
    
    public ParagraphVersionRepositoryImpl(ParagraphVersionJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<ParagraphVersion> findById(Long id) {
        return jpaRepository.findById(id)
            .map(ParagraphVersionEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<ParagraphVersion> findByParagraphIdAndVersionNumber(Long paragraphId, Integer versionNumber) {
        return jpaRepository.findByParagraphIdAndVersionNumber(paragraphId, versionNumber)
            .map(ParagraphVersionEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ParagraphVersion> findByParagraphIdOrderByVersionNumberDesc(Long paragraphId) {
        return jpaRepository.findByParagraphIdOrderByVersionNumberDesc(paragraphId).stream()
            .map(ParagraphVersionEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<ParagraphVersion> findLatestByParagraphId(Long paragraphId) {
        return jpaRepository.findFirstByParagraphIdOrderByVersionNumberDesc(paragraphId)
            .map(ParagraphVersionEntityMapper::toDomain);
    }
    
    @Override
    @Transactional
    public ParagraphVersion save(ParagraphVersion paragraphVersion) {
        ParagraphVersionJpaEntity jpaEntity = ParagraphVersionEntityMapper.toJpa(paragraphVersion);
        ParagraphVersionJpaEntity saved = jpaRepository.save(jpaEntity);
        return ParagraphVersionEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(ParagraphVersion paragraphVersion) {
        jpaRepository.deleteById(paragraphVersion.getId());
    }
}


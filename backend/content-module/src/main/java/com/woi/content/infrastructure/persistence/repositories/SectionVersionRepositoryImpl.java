package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.SectionVersion;
import com.woi.content.domain.repositories.SectionVersionRepository;
import com.woi.content.infrastructure.persistence.entities.SectionVersionJpaEntity;
import com.woi.content.infrastructure.persistence.mappers.SectionVersionEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for SectionVersion
 */
@Repository
public class SectionVersionRepositoryImpl implements SectionVersionRepository {
    
    private final SectionVersionJpaRepository jpaRepository;
    
    public SectionVersionRepositoryImpl(SectionVersionJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<SectionVersion> findById(Long id) {
        return jpaRepository.findById(id)
            .map(SectionVersionEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<SectionVersion> findBySectionIdAndVersionNumber(Long sectionId, Integer versionNumber) {
        return jpaRepository.findBySectionIdAndVersionNumber(sectionId, versionNumber)
            .map(SectionVersionEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SectionVersion> findBySectionIdOrderByVersionNumberDesc(Long sectionId) {
        return jpaRepository.findBySectionIdOrderByVersionNumberDesc(sectionId).stream()
            .map(SectionVersionEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<SectionVersion> findLatestBySectionId(Long sectionId) {
        return jpaRepository.findFirstBySectionIdOrderByVersionNumberDesc(sectionId)
            .map(SectionVersionEntityMapper::toDomain);
    }
    
    @Override
    @Transactional
    public SectionVersion save(SectionVersion sectionVersion) {
        SectionVersionJpaEntity jpaEntity = SectionVersionEntityMapper.toJpa(sectionVersion);
        SectionVersionJpaEntity saved = jpaRepository.save(jpaEntity);
        return SectionVersionEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(SectionVersion sectionVersion) {
        jpaRepository.deleteById(sectionVersion.getId());
    }
}


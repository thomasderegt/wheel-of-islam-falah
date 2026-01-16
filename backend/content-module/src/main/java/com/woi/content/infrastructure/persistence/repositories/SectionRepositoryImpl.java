package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.Section;
import com.woi.content.domain.repositories.SectionRepository;
import com.woi.content.infrastructure.persistence.entities.SectionJpaEntity;
import com.woi.content.infrastructure.persistence.mappers.SectionEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for Section
 */
@Repository
public class SectionRepositoryImpl implements SectionRepository {
    
    private final SectionJpaRepository jpaRepository;
    
    public SectionRepositoryImpl(SectionJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Section> findById(Long id) {
        return jpaRepository.findById(id)
            .map(SectionEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Section> findByChapterId(Long chapterId) {
        return jpaRepository.findByChapterIdOrderByOrderIndex(chapterId).stream()
            .map(SectionEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public Section save(Section section) {
        SectionJpaEntity jpaEntity = SectionEntityMapper.toJpa(section);
        SectionJpaEntity saved = jpaRepository.save(jpaEntity);
        return SectionEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(Section section) {
        jpaRepository.deleteById(section.getId());
    }
}


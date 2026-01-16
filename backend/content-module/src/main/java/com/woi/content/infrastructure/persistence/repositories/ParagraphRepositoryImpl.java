package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.Paragraph;
import com.woi.content.domain.repositories.ParagraphRepository;
import com.woi.content.infrastructure.persistence.entities.ParagraphJpaEntity;
import com.woi.content.infrastructure.persistence.mappers.ParagraphEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for Paragraph
 */
@Repository
public class ParagraphRepositoryImpl implements ParagraphRepository {
    
    private final ParagraphJpaRepository jpaRepository;
    
    public ParagraphRepositoryImpl(ParagraphJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Paragraph> findById(Long id) {
        return jpaRepository.findById(id)
            .map(ParagraphEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Paragraph> findBySectionId(Long sectionId) {
        return jpaRepository.findBySectionId(sectionId).stream()
            .map(ParagraphEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public Paragraph save(Paragraph paragraph) {
        ParagraphJpaEntity jpaEntity = ParagraphEntityMapper.toJpa(paragraph);
        ParagraphJpaEntity saved = jpaRepository.save(jpaEntity);
        return ParagraphEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(Paragraph paragraph) {
        jpaRepository.deleteById(paragraph.getId());
    }
}


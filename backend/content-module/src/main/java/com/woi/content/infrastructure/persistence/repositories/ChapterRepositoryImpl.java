package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.Chapter;
import com.woi.content.domain.repositories.ChapterRepository;
import com.woi.content.infrastructure.persistence.entities.ChapterJpaEntity;
import com.woi.content.infrastructure.persistence.mappers.ChapterEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for Chapter
 */
@Repository
public class ChapterRepositoryImpl implements ChapterRepository {
    
    private final ChapterJpaRepository jpaRepository;
    
    public ChapterRepositoryImpl(ChapterJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Chapter> findById(Long id) {
        return jpaRepository.findById(id)
            .map(ChapterEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Chapter> findByBookId(Long bookId) {
        return jpaRepository.findByBookId(bookId).stream()
            .map(ChapterEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public Chapter save(Chapter chapter) {
        ChapterJpaEntity jpaEntity = ChapterEntityMapper.toJpa(chapter);
        ChapterJpaEntity saved = jpaRepository.save(jpaEntity);
        return ChapterEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(Chapter chapter) {
        jpaRepository.deleteById(chapter.getId());
    }
}


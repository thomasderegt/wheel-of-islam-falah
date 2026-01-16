package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.ChapterVersion;
import com.woi.content.domain.repositories.ChapterVersionRepository;
import com.woi.content.infrastructure.persistence.entities.ChapterVersionJpaEntity;
import com.woi.content.infrastructure.persistence.mappers.ChapterVersionEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for ChapterVersion
 */
@Repository
public class ChapterVersionRepositoryImpl implements ChapterVersionRepository {
    
    private final ChapterVersionJpaRepository jpaRepository;
    
    public ChapterVersionRepositoryImpl(ChapterVersionJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<ChapterVersion> findById(Long id) {
        return jpaRepository.findById(id)
            .map(ChapterVersionEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<ChapterVersion> findByChapterIdAndVersionNumber(Long chapterId, Integer versionNumber) {
        return jpaRepository.findByChapterIdAndVersionNumber(chapterId, versionNumber)
            .map(ChapterVersionEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ChapterVersion> findByChapterIdOrderByVersionNumberDesc(Long chapterId) {
        return jpaRepository.findByChapterIdOrderByVersionNumberDesc(chapterId).stream()
            .map(ChapterVersionEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<ChapterVersion> findLatestByChapterId(Long chapterId) {
        return jpaRepository.findFirstByChapterIdOrderByVersionNumberDesc(chapterId)
            .map(ChapterVersionEntityMapper::toDomain);
    }
    
    @Override
    @Transactional
    public ChapterVersion save(ChapterVersion chapterVersion) {
        ChapterVersionJpaEntity jpaEntity = ChapterVersionEntityMapper.toJpa(chapterVersion);
        ChapterVersionJpaEntity saved = jpaRepository.save(jpaEntity);
        return ChapterVersionEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(ChapterVersion chapterVersion) {
        jpaRepository.deleteById(chapterVersion.getId());
    }
}


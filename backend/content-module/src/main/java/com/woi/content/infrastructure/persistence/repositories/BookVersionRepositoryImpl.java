package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.BookVersion;
import com.woi.content.domain.repositories.BookVersionRepository;
import com.woi.content.infrastructure.persistence.entities.BookVersionJpaEntity;
import com.woi.content.infrastructure.persistence.mappers.BookVersionEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for BookVersion
 */
@Repository
public class BookVersionRepositoryImpl implements BookVersionRepository {
    
    private final BookVersionJpaRepository jpaRepository;
    
    public BookVersionRepositoryImpl(BookVersionJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<BookVersion> findById(Long id) {
        return jpaRepository.findById(id)
            .map(BookVersionEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<BookVersion> findByBookIdAndVersionNumber(Long bookId, Integer versionNumber) {
        return jpaRepository.findByBookIdAndVersionNumber(bookId, versionNumber)
            .map(BookVersionEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<BookVersion> findByBookIdOrderByVersionNumberDesc(Long bookId) {
        return jpaRepository.findByBookIdOrderByVersionNumberDesc(bookId).stream()
            .map(BookVersionEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<BookVersion> findLatestByBookId(Long bookId) {
        return jpaRepository.findFirstByBookIdOrderByVersionNumberDesc(bookId)
            .map(BookVersionEntityMapper::toDomain);
    }
    
    @Override
    @Transactional
    public BookVersion save(BookVersion bookVersion) {
        BookVersionJpaEntity jpaEntity = BookVersionEntityMapper.toJpa(bookVersion);
        BookVersionJpaEntity saved = jpaRepository.save(jpaEntity);
        return BookVersionEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(BookVersion bookVersion) {
        jpaRepository.deleteById(bookVersion.getId());
    }
}


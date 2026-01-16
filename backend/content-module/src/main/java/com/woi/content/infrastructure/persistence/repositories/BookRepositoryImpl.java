package com.woi.content.infrastructure.persistence.repositories;

import com.woi.content.domain.entities.Book;
import com.woi.content.domain.repositories.BookRepository;
import com.woi.content.infrastructure.persistence.entities.BookJpaEntity;
import com.woi.content.infrastructure.persistence.mappers.BookEntityMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Repository implementation for Book
 */
@Repository
public class BookRepositoryImpl implements BookRepository {
    
    private final BookJpaRepository jpaRepository;
    
    public BookRepositoryImpl(BookJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<Book> findById(Long id) {
        return jpaRepository.findById(id)
            .map(BookEntityMapper::toDomain);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Book> findByCategoryId(Long categoryId) {
        return jpaRepository.findByCategoryId(categoryId).stream()
            .map(BookEntityMapper::toDomain)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public Book save(Book book) {
        BookJpaEntity jpaEntity = BookEntityMapper.toJpa(book);
        BookJpaEntity saved = jpaRepository.save(jpaEntity);
        return BookEntityMapper.toDomain(saved);
    }
    
    @Override
    @Transactional
    public void delete(Book book) {
        jpaRepository.deleteById(book.getId());
    }
}


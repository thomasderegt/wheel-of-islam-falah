package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.Book;

import java.util.List;
import java.util.Optional;

/**
 * Book repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface BookRepository {
    Optional<Book> findById(Long id);
    List<Book> findByCategoryId(Long categoryId);
    Book save(Book book);
    void delete(Book book);
}


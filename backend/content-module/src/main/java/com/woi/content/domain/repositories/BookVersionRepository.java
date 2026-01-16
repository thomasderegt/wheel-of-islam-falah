package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.BookVersion;

import java.util.List;
import java.util.Optional;

/**
 * BookVersion repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface BookVersionRepository {
    Optional<BookVersion> findById(Long id);
    Optional<BookVersion> findByBookIdAndVersionNumber(Long bookId, Integer versionNumber);
    List<BookVersion> findByBookIdOrderByVersionNumberDesc(Long bookId);
    Optional<BookVersion> findLatestByBookId(Long bookId);
    BookVersion save(BookVersion bookVersion);
    void delete(BookVersion bookVersion);
}


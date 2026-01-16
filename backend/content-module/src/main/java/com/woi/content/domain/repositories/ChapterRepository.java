package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.Chapter;

import java.util.List;
import java.util.Optional;

/**
 * Chapter repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface ChapterRepository {
    Optional<Chapter> findById(Long id);
    List<Chapter> findByBookId(Long bookId);
    Chapter save(Chapter chapter);
    void delete(Chapter chapter);
}


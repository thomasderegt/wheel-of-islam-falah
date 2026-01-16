package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.Section;

import java.util.List;
import java.util.Optional;

/**
 * Section repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface SectionRepository {
    Optional<Section> findById(Long id);
    List<Section> findByChapterId(Long chapterId);
    Section save(Section section);
    void delete(Section section);
}


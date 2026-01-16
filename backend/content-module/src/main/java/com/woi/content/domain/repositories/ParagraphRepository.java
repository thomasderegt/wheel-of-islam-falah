package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.Paragraph;

import java.util.List;
import java.util.Optional;

/**
 * Paragraph repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface ParagraphRepository {
    Optional<Paragraph> findById(Long id);
    List<Paragraph> findBySectionId(Long sectionId);
    Paragraph save(Paragraph paragraph);
    void delete(Paragraph paragraph);
}


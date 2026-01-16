package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.ParagraphVersion;

import java.util.List;
import java.util.Optional;

/**
 * ParagraphVersion repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface ParagraphVersionRepository {
    Optional<ParagraphVersion> findById(Long id);
    Optional<ParagraphVersion> findByParagraphIdAndVersionNumber(Long paragraphId, Integer versionNumber);
    List<ParagraphVersion> findByParagraphIdOrderByVersionNumberDesc(Long paragraphId);
    Optional<ParagraphVersion> findLatestByParagraphId(Long paragraphId);
    ParagraphVersion save(ParagraphVersion paragraphVersion);
    void delete(ParagraphVersion paragraphVersion);
}


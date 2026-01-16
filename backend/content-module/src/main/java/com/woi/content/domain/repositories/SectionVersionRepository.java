package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.SectionVersion;

import java.util.List;
import java.util.Optional;

/**
 * SectionVersion repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface SectionVersionRepository {
    Optional<SectionVersion> findById(Long id);
    Optional<SectionVersion> findBySectionIdAndVersionNumber(Long sectionId, Integer versionNumber);
    List<SectionVersion> findBySectionIdOrderByVersionNumberDesc(Long sectionId);
    Optional<SectionVersion> findLatestBySectionId(Long sectionId);
    SectionVersion save(SectionVersion sectionVersion);
    void delete(SectionVersion sectionVersion);
}


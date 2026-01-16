package com.woi.content.domain.repositories;

import com.woi.content.domain.entities.ChapterVersion;

import java.util.List;
import java.util.Optional;

/**
 * ChapterVersion repository interface - Domain layer
 * Pure Java interface (no Spring Data dependencies)
 */
public interface ChapterVersionRepository {
    Optional<ChapterVersion> findById(Long id);
    Optional<ChapterVersion> findByChapterIdAndVersionNumber(Long chapterId, Integer versionNumber);
    List<ChapterVersion> findByChapterIdOrderByVersionNumberDesc(Long chapterId);
    Optional<ChapterVersion> findLatestByChapterId(Long chapterId);
    ChapterVersion save(ChapterVersion chapterVersion);
    void delete(ChapterVersion chapterVersion);
}


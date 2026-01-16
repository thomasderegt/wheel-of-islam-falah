package com.woi.content.domain.services;

import com.woi.content.domain.repositories.BookVersionRepository;
import com.woi.content.domain.repositories.ChapterVersionRepository;
import com.woi.content.domain.repositories.SectionVersionRepository;
import org.springframework.stereotype.Service;

/**
 * Domain service for generating version numbers
 * Business rule: New version gets next version number (1, 2, 3, ...)
 * 
 * Note: This is a domain service but needs Spring annotation for dependency injection
 */
@Service
public class VersionNumberGenerator {
    
    private final SectionVersionRepository sectionVersionRepository;
    private final BookVersionRepository bookVersionRepository;
    private final ChapterVersionRepository chapterVersionRepository;
    
    public VersionNumberGenerator(
            SectionVersionRepository sectionVersionRepository,
            BookVersionRepository bookVersionRepository,
            ChapterVersionRepository chapterVersionRepository) {
        this.sectionVersionRepository = sectionVersionRepository;
        this.bookVersionRepository = bookVersionRepository;
        this.chapterVersionRepository = chapterVersionRepository;
    }
    
    /**
     * Generate next version number for a section
     * 
     * @param sectionId Section ID
     * @return Next version number (1 if no versions exist, otherwise highest + 1)
     */
    public Integer generateNextVersionNumber(Long sectionId) {
        return sectionVersionRepository.findLatestBySectionId(sectionId)
            .map(version -> version.getVersionNumber() + 1)
            .orElse(1);
    }
    
    /**
     * Generate next version number for a book
     * 
     * @param bookId Book ID
     * @return Next version number (1 if no versions exist, otherwise highest + 1)
     */
    public Integer generateNextBookVersionNumber(Long bookId) {
        return bookVersionRepository.findLatestByBookId(bookId)
            .map(version -> version.getVersionNumber() + 1)
            .orElse(1);
    }
    
    /**
     * Generate next version number for a chapter
     * 
     * @param chapterId Chapter ID
     * @return Next version number (1 if no versions exist, otherwise highest + 1)
     */
    public Integer generateNextChapterVersionNumber(Long chapterId) {
        return chapterVersionRepository.findLatestByChapterId(chapterId)
            .map(version -> version.getVersionNumber() + 1)
            .orElse(1);
    }
}


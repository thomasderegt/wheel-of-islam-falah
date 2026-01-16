package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.CreateChapterVersionCommand;
import com.woi.content.application.results.ChapterVersionResult;
import com.woi.content.domain.entities.Chapter;
import com.woi.content.domain.entities.ChapterVersion;
import com.woi.content.domain.repositories.ChapterRepository;
import com.woi.content.domain.repositories.ChapterVersionRepository;
import com.woi.content.domain.services.VersionNumberGenerator;
import org.springframework.stereotype.Component;

/**
 * Command handler for creating a new chapter version
 * 
 * Responsibilities:
 * - Generate version number
 * - Create chapter version (domain validates and applies title fallback)
 * - Update chapter's workingStatusChapterVersionId pointer
 */
@Component
public class CreateChapterVersionCommandHandler {
    private final ChapterRepository chapterRepository;
    private final ChapterVersionRepository chapterVersionRepository;
    private final VersionNumberGenerator versionNumberGenerator;
    
    public CreateChapterVersionCommandHandler(
            ChapterRepository chapterRepository,
            ChapterVersionRepository chapterVersionRepository,
            VersionNumberGenerator versionNumberGenerator) {
        this.chapterRepository = chapterRepository;
        this.chapterVersionRepository = chapterVersionRepository;
        this.versionNumberGenerator = versionNumberGenerator;
    }
    
    public ChapterVersionResult handle(CreateChapterVersionCommand command) {
        // 1. Find chapter
        Chapter chapter = chapterRepository.findById(command.chapterId())
            .orElseThrow(() -> new IllegalArgumentException("Chapter not found: " + command.chapterId()));
        
        // 2. Generate next version number (domain service)
        Integer versionNumber = versionNumberGenerator.generateNextChapterVersionNumber(command.chapterId());
        
        // 3. Create chapter version (domain factory method - validates and applies title fallback)
        ChapterVersion version = ChapterVersion.create(
            command.chapterId(),
            versionNumber,
            command.titleEn(),
            command.titleNl(),
            command.introEn(),
            command.introNl(),
            command.userId()
        );
        
        // 4. Save version
        ChapterVersion savedVersion = chapterVersionRepository.save(version);
        
        // 5. Update chapter's workingStatusChapterVersionId pointer
        chapter.setWorkingStatusChapterVersionId(savedVersion.getId());
        chapterRepository.save(chapter);
        
        // 6. Return result
        return ChapterVersionResult.from(savedVersion);
    }
}


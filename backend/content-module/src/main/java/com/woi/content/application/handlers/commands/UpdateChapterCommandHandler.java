package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.UpdateChapterCommand;
import com.woi.content.application.results.ChapterResult;
import com.woi.content.domain.entities.Chapter;
import com.woi.content.domain.repositories.ChapterRepository;
import org.springframework.stereotype.Component;

/**
 * Command handler for updating chapter metadata
 * 
 * Responsibilities:
 * - Update chapter number and/or position (domain validates)
 */
@Component
public class UpdateChapterCommandHandler {
    private final ChapterRepository chapterRepository;
    
    public UpdateChapterCommandHandler(ChapterRepository chapterRepository) {
        this.chapterRepository = chapterRepository;
    }
    
    public ChapterResult handle(UpdateChapterCommand command) {
        // 1. Find chapter
        Chapter chapter = chapterRepository.findById(command.chapterId())
            .orElseThrow(() -> new IllegalArgumentException("Chapter not found: " + command.chapterId()));
        
        // 2. Update chapter number (if provided)
        if (command.chapterNumber() != null) {
            chapter.setChapterNumber(command.chapterNumber());
        }
        
        // 3. Update position (if provided)
        if (command.position() != null) {
            chapter.updatePosition(command.position());
        }
        
        // 4. Save chapter
        Chapter savedChapter = chapterRepository.save(chapter);
        
        // 5. Return result
        return ChapterResult.from(savedChapter);
    }
}


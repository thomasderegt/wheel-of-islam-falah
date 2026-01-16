package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.CreateChapterCommand;
import com.woi.content.application.results.ChapterResult;
import com.woi.content.domain.entities.Chapter;
import com.woi.content.domain.repositories.BookRepository;
import com.woi.content.domain.repositories.ChapterRepository;
import com.woi.content.domain.repositories.ContentStatusRepository;
import org.springframework.stereotype.Component;

/**
 * Command handler for creating a new chapter
 * 
 * Responsibilities:
 * - Orchestrate chapter creation
 * - Validate book exists
 * - Create ContentStatus with DRAFT status
 */
@Component
public class CreateChapterCommandHandler {
    private final ChapterRepository chapterRepository;
    private final BookRepository bookRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public CreateChapterCommandHandler(
            ChapterRepository chapterRepository,
            BookRepository bookRepository,
            ContentStatusRepository contentStatusRepository) {
        this.chapterRepository = chapterRepository;
        this.bookRepository = bookRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    public ChapterResult handle(CreateChapterCommand command) {
        // 1. Validate book exists
        bookRepository.findById(command.bookId())
            .orElseThrow(() -> new IllegalArgumentException("Book not found: " + command.bookId()));
        
        // 2. Create chapter (domain factory method - validates bookId and position)
        Chapter chapter = Chapter.create(command.bookId(), command.position());
        
        // 3. Save chapter
        Chapter savedChapter = chapterRepository.save(chapter);
        
        // 4. Create ContentStatus with DRAFT status
        com.woi.content.domain.entities.ContentStatus contentStatus = 
            com.woi.content.domain.entities.ContentStatus.create(
                savedChapter.getEntityTypeForStatus(),
                savedChapter.getId(),
                com.woi.content.domain.enums.ContentStatusType.DRAFT,
                null  // userId can be null for initial creation
            );
        contentStatusRepository.save(contentStatus);
        
        // 5. Return result
        return ChapterResult.from(savedChapter);
    }
}


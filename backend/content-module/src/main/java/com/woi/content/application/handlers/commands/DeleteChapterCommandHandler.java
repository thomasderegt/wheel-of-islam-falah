package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.DeleteChapterCommand;
import com.woi.content.domain.entities.Chapter;
import com.woi.content.domain.entities.Paragraph;
import com.woi.content.domain.entities.Section;
import com.woi.content.domain.repositories.ChapterRepository;
import com.woi.content.domain.repositories.ParagraphRepository;
import com.woi.content.domain.repositories.SectionRepository;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Command handler for deleting a chapter
 * 
 * Responsibilities:
 * - Validate that chapter exists
 * - Cascade delete: Delete all sections (and their paragraphs) in this chapter
 * - Delete chapter
 */
@Component
public class DeleteChapterCommandHandler {
    private final ChapterRepository chapterRepository;
    private final SectionRepository sectionRepository;
    private final ParagraphRepository paragraphRepository;
    
    public DeleteChapterCommandHandler(
            ChapterRepository chapterRepository,
            SectionRepository sectionRepository,
            ParagraphRepository paragraphRepository) {
        this.chapterRepository = chapterRepository;
        this.sectionRepository = sectionRepository;
        this.paragraphRepository = paragraphRepository;
    }
    
    public void handle(DeleteChapterCommand command) {
        // 1. Find chapter
        Chapter chapter = chapterRepository.findById(command.chapterId())
            .orElseThrow(() -> new IllegalArgumentException("Chapter not found: " + command.chapterId()));
        
        // 2. Cascade delete: Delete all sections (and their paragraphs) in this chapter
        List<Section> sections = sectionRepository.findByChapterId(command.chapterId());
        for (Section section : sections) {
            // Delete all paragraphs in this section
            List<Paragraph> paragraphs = paragraphRepository.findBySectionId(section.getId());
            for (Paragraph paragraph : paragraphs) {
                // TODO: Check if paragraph is used in Learning module before deleting
                paragraphRepository.delete(paragraph);
            }
            // Delete section
            sectionRepository.delete(section);
        }
        
        // 3. Delete chapter
        chapterRepository.delete(chapter);
    }
}


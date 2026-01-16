package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.DeleteBookCommand;
import com.woi.content.domain.entities.Book;
import com.woi.content.domain.entities.Chapter;
import com.woi.content.domain.entities.Paragraph;
import com.woi.content.domain.entities.Section;
import com.woi.content.domain.repositories.BookRepository;
import com.woi.content.domain.repositories.ChapterRepository;
import com.woi.content.domain.repositories.ParagraphRepository;
import com.woi.content.domain.repositories.SectionRepository;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Command handler for deleting a book
 * 
 * Responsibilities:
 * - Validate that book exists
 * - Cascade delete: Delete all chapters (and their sections and paragraphs) in this book
 * - Delete book
 */
@Component
public class DeleteBookCommandHandler {
    private final BookRepository bookRepository;
    private final ChapterRepository chapterRepository;
    private final SectionRepository sectionRepository;
    private final ParagraphRepository paragraphRepository;
    
    public DeleteBookCommandHandler(
            BookRepository bookRepository,
            ChapterRepository chapterRepository,
            SectionRepository sectionRepository,
            ParagraphRepository paragraphRepository) {
        this.bookRepository = bookRepository;
        this.chapterRepository = chapterRepository;
        this.sectionRepository = sectionRepository;
        this.paragraphRepository = paragraphRepository;
    }
    
    public void handle(DeleteBookCommand command) {
        // 1. Find book
        Book book = bookRepository.findById(command.bookId())
            .orElseThrow(() -> new IllegalArgumentException("Book not found: " + command.bookId()));
        
        // 2. Cascade delete: Delete all chapters (and their sections and paragraphs) in this book
        List<Chapter> chapters = chapterRepository.findByBookId(command.bookId());
        for (Chapter chapter : chapters) {
            // Delete all sections in this chapter
            List<Section> sections = sectionRepository.findByChapterId(chapter.getId());
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
            // Delete chapter
            chapterRepository.delete(chapter);
        }
        
        // 3. Delete book
        bookRepository.delete(book);
    }
}


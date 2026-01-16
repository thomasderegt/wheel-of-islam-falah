package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.DeleteCategoryCommand;
import com.woi.content.domain.constants.SystemCategories;
import com.woi.content.domain.entities.Book;
import com.woi.content.domain.entities.Category;
import com.woi.content.domain.entities.Chapter;
import com.woi.content.domain.entities.Paragraph;
import com.woi.content.domain.entities.Section;
import com.woi.content.domain.repositories.BookRepository;
import com.woi.content.domain.repositories.CategoryRepository;
import com.woi.content.domain.repositories.ChapterRepository;
import com.woi.content.domain.repositories.ParagraphRepository;
import com.woi.content.domain.repositories.SectionRepository;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Command handler for deleting a category
 * 
 * Responsibilities:
 * - Validate that category exists
 * - Cascade delete: Delete all books (and their chapters, sections, and paragraphs) in this category
 * - Delete category
 */
@Component
public class DeleteCategoryCommandHandler {
    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final ChapterRepository chapterRepository;
    private final SectionRepository sectionRepository;
    private final ParagraphRepository paragraphRepository;
    
    public DeleteCategoryCommandHandler(
            CategoryRepository categoryRepository,
            BookRepository bookRepository,
            ChapterRepository chapterRepository,
            SectionRepository sectionRepository,
            ParagraphRepository paragraphRepository) {
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
        this.chapterRepository = chapterRepository;
        this.sectionRepository = sectionRepository;
        this.paragraphRepository = paragraphRepository;
    }
    
    public void handle(DeleteCategoryCommand command) {
        // 1. Find category
        Category category = categoryRepository.findById(command.categoryId())
            .orElseThrow(() -> new IllegalArgumentException("Category not found: " + command.categoryId()));
        
        // 2. Check if it's a system category (cannot be deleted)
        if (SystemCategories.isSystemCategory(category.getCategoryNumber())) {
            throw new IllegalStateException("System categories cannot be deleted");
        }
        
        // 3. Cascade delete: Delete all books (and their chapters, sections, and paragraphs) in this category
        List<Book> books = bookRepository.findByCategoryId(command.categoryId());
        for (Book book : books) {
            // Delete all chapters in this book
            List<Chapter> chapters = chapterRepository.findByBookId(book.getId());
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
            // Delete book
            bookRepository.delete(book);
        }
        
        // 4. Delete category
        categoryRepository.delete(category);
    }
}


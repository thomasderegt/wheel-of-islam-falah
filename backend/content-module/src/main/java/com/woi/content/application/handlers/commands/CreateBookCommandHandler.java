package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.CreateBookCommand;
import com.woi.content.application.results.BookResult;
import com.woi.content.domain.entities.Book;
import com.woi.content.domain.repositories.BookRepository;
import com.woi.content.domain.repositories.CategoryRepository;
import com.woi.content.domain.repositories.ContentStatusRepository;
import org.springframework.stereotype.Component;

/**
 * Command handler for creating a new book
 * 
 * Responsibilities:
 * - Orchestrate book creation
 * - Validate category exists
 * - Create ContentStatus with DRAFT status
 */
@Component
public class CreateBookCommandHandler {
    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final ContentStatusRepository contentStatusRepository;
    
    public CreateBookCommandHandler(
            BookRepository bookRepository,
            CategoryRepository categoryRepository,
            ContentStatusRepository contentStatusRepository) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.contentStatusRepository = contentStatusRepository;
    }
    
    public BookResult handle(CreateBookCommand command) {
        // 1. Validate category exists
        categoryRepository.findById(command.categoryId())
            .orElseThrow(() -> new IllegalArgumentException("Category not found: " + command.categoryId()));
        
        // 2. Create book (domain factory method - validates categoryId)
        Book book = Book.create(command.categoryId());
        
        // 3. Save book
        Book savedBook = bookRepository.save(book);
        
        // 4. Create ContentStatus with DRAFT status
        com.woi.content.domain.entities.ContentStatus contentStatus = 
            com.woi.content.domain.entities.ContentStatus.create(
                savedBook.getEntityTypeForStatus(),
                savedBook.getId(),
                com.woi.content.domain.enums.ContentStatusType.DRAFT,
                null  // userId can be null for initial creation
            );
        contentStatusRepository.save(contentStatus);
        
        // 5. Return result
        return BookResult.from(savedBook);
    }
}


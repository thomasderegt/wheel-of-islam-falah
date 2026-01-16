package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.UpdateBookCommand;
import com.woi.content.application.results.BookResult;
import com.woi.content.domain.entities.Book;
import com.woi.content.domain.repositories.BookRepository;
import org.springframework.stereotype.Component;

/**
 * Command handler for updating book metadata
 * 
 * Responsibilities:
 * - Update book number (domain validates)
 */
@Component
public class UpdateBookCommandHandler {
    private final BookRepository bookRepository;
    
    public UpdateBookCommandHandler(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }
    
    public BookResult handle(UpdateBookCommand command) {
        // 1. Find book
        Book book = bookRepository.findById(command.bookId())
            .orElseThrow(() -> new IllegalArgumentException("Book not found: " + command.bookId()));
        
        // 2. Update book number (domain method - validates)
        if (command.bookNumber() != null) {
            book.setBookNumber(command.bookNumber());
        }
        
        // 3. Save book
        Book savedBook = bookRepository.save(book);
        
        // 4. Return result
        return BookResult.from(savedBook);
    }
}


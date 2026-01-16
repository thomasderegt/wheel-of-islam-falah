package com.woi.content.application.handlers.commands;

import com.woi.content.application.commands.CreateBookVersionCommand;
import com.woi.content.application.results.BookVersionResult;
import com.woi.content.domain.entities.Book;
import com.woi.content.domain.entities.BookVersion;
import com.woi.content.domain.repositories.BookRepository;
import com.woi.content.domain.repositories.BookVersionRepository;
import com.woi.content.domain.services.VersionNumberGenerator;
import org.springframework.stereotype.Component;

/**
 * Command handler for creating a new book version
 * 
 * Responsibilities:
 * - Generate version number
 * - Create book version (domain validates and applies title fallback)
 * - Update book's workingStatusBookVersionId pointer
 */
@Component
public class CreateBookVersionCommandHandler {
    private final BookRepository bookRepository;
    private final BookVersionRepository bookVersionRepository;
    private final VersionNumberGenerator versionNumberGenerator;
    
    public CreateBookVersionCommandHandler(
            BookRepository bookRepository,
            BookVersionRepository bookVersionRepository,
            VersionNumberGenerator versionNumberGenerator) {
        this.bookRepository = bookRepository;
        this.bookVersionRepository = bookVersionRepository;
        this.versionNumberGenerator = versionNumberGenerator;
    }
    
    public BookVersionResult handle(CreateBookVersionCommand command) {
        // 1. Find book
        Book book = bookRepository.findById(command.bookId())
            .orElseThrow(() -> new IllegalArgumentException("Book not found: " + command.bookId()));
        
        // 2. Generate next version number (domain service)
        Integer versionNumber = versionNumberGenerator.generateNextBookVersionNumber(command.bookId());
        
        // 3. Create book version (domain factory method - validates and applies title fallback)
        BookVersion version = BookVersion.create(
            command.bookId(),
            versionNumber,
            command.titleEn(),
            command.titleNl(),
            command.introEn(),
            command.introNl(),
            command.userId()
        );
        
        // 4. Save version
        BookVersion savedVersion = bookVersionRepository.save(version);
        
        // 5. Update book's workingStatusBookVersionId pointer
        book.setWorkingStatusBookVersionId(savedVersion.getId());
        bookRepository.save(book);
        
        // 6. Return result
        return BookVersionResult.from(savedVersion);
    }
}


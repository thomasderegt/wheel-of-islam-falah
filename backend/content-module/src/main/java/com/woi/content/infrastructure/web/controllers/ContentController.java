package com.woi.content.infrastructure.web.controllers;

import com.woi.content.application.commands.CreateBookCommand;
import com.woi.content.application.commands.CreateCategoryCommand;
import com.woi.content.application.commands.CreateChapterCommand;
import com.woi.content.application.commands.CreateParagraphCommand;
import com.woi.content.application.commands.CreateSectionCommand;
import com.woi.content.application.commands.CreateSectionVersionCommand;
import com.woi.content.application.commands.CreateBookVersionCommand;
import com.woi.content.application.commands.CreateChapterVersionCommand;
import com.woi.content.application.commands.PublishSectionCommand;
import com.woi.content.application.commands.DeleteBookCommand;
import com.woi.content.application.commands.DeleteCategoryCommand;
import com.woi.content.application.commands.DeleteChapterCommand;
import com.woi.content.application.commands.DeleteParagraphCommand;
import com.woi.content.application.commands.DeleteSectionCommand;
import com.woi.content.application.commands.UpdateBookCommand;
import com.woi.content.application.commands.UpdateCategoryCommand;
import com.woi.content.application.commands.UpdateChapterCommand;
import com.woi.content.application.commands.UpdateParagraphCommand;
import com.woi.content.application.commands.UpdateSectionCommand;
import com.woi.content.application.handlers.commands.CreateBookCommandHandler;
import com.woi.content.application.handlers.commands.CreateCategoryCommandHandler;
import com.woi.content.application.handlers.commands.CreateChapterCommandHandler;
import com.woi.content.application.handlers.commands.CreateParagraphCommandHandler;
import com.woi.content.application.handlers.commands.CreateSectionCommandHandler;
import com.woi.content.application.handlers.commands.CreateSectionVersionCommandHandler;
import com.woi.content.application.handlers.commands.CreateBookVersionCommandHandler;
import com.woi.content.application.handlers.commands.CreateChapterVersionCommandHandler;
import com.woi.content.application.handlers.commands.PublishSectionCommandHandler;
import com.woi.content.application.handlers.commands.DeleteBookCommandHandler;
import com.woi.content.application.handlers.commands.DeleteCategoryCommandHandler;
import com.woi.content.application.handlers.commands.DeleteChapterCommandHandler;
import com.woi.content.application.handlers.commands.DeleteParagraphCommandHandler;
import com.woi.content.application.handlers.commands.DeleteSectionCommandHandler;
import com.woi.content.application.handlers.commands.UpdateBookCommandHandler;
import com.woi.content.application.handlers.commands.UpdateCategoryCommandHandler;
import com.woi.content.application.handlers.commands.UpdateChapterCommandHandler;
import com.woi.content.application.handlers.commands.UpdateParagraphCommandHandler;
import com.woi.content.application.handlers.commands.UpdateSectionCommandHandler;
import com.woi.content.application.handlers.queries.GetAllCategoriesQueryHandler;
import com.woi.content.application.handlers.queries.GetBookQueryHandler;
import com.woi.content.application.handlers.queries.GetBooksByCategoryQueryHandler;
import com.woi.content.application.handlers.queries.GetPublicBooksByCategoryQueryHandler;
import com.woi.content.application.handlers.queries.GetPublicChaptersByBookQueryHandler;
import com.woi.content.application.handlers.queries.GetPublicSectionsByChapterQueryHandler;
import com.woi.content.application.handlers.queries.GetPublicParagraphsBySectionQueryHandler;
import com.woi.content.application.handlers.queries.GetCategoryQueryHandler;
import com.woi.content.application.handlers.queries.GetCategoryByNumberQueryHandler;
import com.woi.content.application.handlers.queries.GetCategoriesByWheelIdQueryHandler;
import com.woi.content.application.handlers.queries.GetAllWheelsQueryHandler;
import com.woi.content.application.handlers.queries.GetWheelByKeyQueryHandler;
import com.woi.content.application.handlers.queries.GetChapterQueryHandler;
import com.woi.content.application.handlers.queries.GetChaptersByBookQueryHandler;
import com.woi.content.application.handlers.queries.GetSectionsByChapterQueryHandler;
import com.woi.content.application.handlers.queries.GetParagraphQueryHandler;
import com.woi.content.application.handlers.queries.GetParagraphsBySectionQueryHandler;
import com.woi.content.application.handlers.queries.GetSectionCurrentVersionQueryHandler;
import com.woi.content.application.handlers.queries.GetSectionPublishedVersionQueryHandler;
import com.woi.content.application.handlers.queries.GetSectionQueryHandler;
import com.woi.content.application.handlers.queries.GetBookCurrentVersionQueryHandler;
import com.woi.content.application.handlers.queries.GetChapterCurrentVersionQueryHandler;
import com.woi.content.application.handlers.queries.GetBookVersionHistoryQueryHandler;
import com.woi.content.application.handlers.queries.GetChapterVersionHistoryQueryHandler;
import com.woi.content.application.handlers.queries.GetParagraphVersionHistoryQueryHandler;
import com.woi.content.application.handlers.queries.GetSectionVersionHistoryQueryHandler;
import com.woi.content.application.queries.GetAllCategoriesQuery;
import com.woi.content.application.queries.GetBookQuery;
import com.woi.content.application.queries.GetBookCurrentVersionQuery;
import com.woi.content.application.queries.GetChapterCurrentVersionQuery;
import com.woi.content.application.queries.GetBooksByCategoryQuery;
import com.woi.content.application.queries.GetPublicBooksByCategoryQuery;
import com.woi.content.application.queries.GetPublicChaptersByBookQuery;
import com.woi.content.application.queries.GetPublicSectionsByChapterQuery;
import com.woi.content.application.queries.GetPublicParagraphsBySectionQuery;
import com.woi.content.application.queries.GetCategoryQuery;
import com.woi.content.application.queries.GetCategoryByNumberQuery;
import com.woi.content.application.queries.GetCategoriesByWheelIdQuery;
import com.woi.content.application.queries.GetAllWheelsQuery;
import com.woi.content.application.queries.GetWheelByKeyQuery;
import com.woi.content.application.queries.GetChapterQuery;
import com.woi.content.application.queries.GetChaptersByBookQuery;
import com.woi.content.application.queries.GetSectionsByChapterQuery;
import com.woi.content.application.queries.GetParagraphQuery;
import com.woi.content.application.queries.GetParagraphsBySectionQuery;
import com.woi.content.application.queries.GetSectionCurrentVersionQuery;
import com.woi.content.application.queries.GetSectionPublishedVersionQuery;
import com.woi.content.application.queries.GetSectionQuery;
import com.woi.content.application.queries.GetBookVersionHistoryQuery;
import com.woi.content.application.queries.GetChapterVersionHistoryQuery;
import com.woi.content.application.queries.GetParagraphVersionHistoryQuery;
import com.woi.content.application.queries.GetSectionVersionHistoryQuery;
import com.woi.content.infrastructure.web.dtos.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST Controller for Content Management
 * v1: Category and Section endpoints
 */
@RestController
@RequestMapping("/api/v2/content")
@CrossOrigin(origins = "*")
public class ContentController {
    
    private final CreateCategoryCommandHandler createCategoryHandler;
    private final UpdateCategoryCommandHandler updateCategoryHandler;
    private final DeleteCategoryCommandHandler deleteCategoryHandler;
    private final GetCategoryQueryHandler getCategoryHandler;
    private final GetCategoryByNumberQueryHandler getCategoryByNumberHandler;
    private final GetAllCategoriesQueryHandler getAllCategoriesHandler;
    private final GetCategoriesByWheelIdQueryHandler getCategoriesByWheelIdHandler;
    private final GetAllWheelsQueryHandler getAllWheelsHandler;
    private final GetWheelByKeyQueryHandler getWheelByKeyHandler;
    private final CreateBookCommandHandler createBookHandler;
    private final UpdateBookCommandHandler updateBookHandler;
    private final DeleteBookCommandHandler deleteBookHandler;
    private final GetBookQueryHandler getBookHandler;
    private final GetBooksByCategoryQueryHandler getBooksByCategoryHandler;
    private final GetPublicBooksByCategoryQueryHandler getPublicBooksByCategoryHandler;
    private final GetPublicChaptersByBookQueryHandler getPublicChaptersByBookHandler;
    private final GetPublicSectionsByChapterQueryHandler getPublicSectionsByChapterHandler;
    private final GetPublicParagraphsBySectionQueryHandler getPublicParagraphsBySectionHandler;
    private final CreateChapterCommandHandler createChapterHandler;
    private final UpdateChapterCommandHandler updateChapterHandler;
    private final DeleteChapterCommandHandler deleteChapterHandler;
    private final GetChapterQueryHandler getChapterHandler;
    private final GetChaptersByBookQueryHandler getChaptersByBookHandler;
    private final GetSectionsByChapterQueryHandler getSectionsByChapterHandler;
    private final CreateParagraphCommandHandler createParagraphHandler;
    private final UpdateParagraphCommandHandler updateParagraphHandler;
    private final DeleteParagraphCommandHandler deleteParagraphHandler;
    private final GetParagraphQueryHandler getParagraphHandler;
    private final GetParagraphsBySectionQueryHandler getParagraphsBySectionHandler;
    private final CreateSectionCommandHandler createSectionHandler;
    private final CreateSectionVersionCommandHandler createSectionVersionHandler;
    private final CreateBookVersionCommandHandler createBookVersionHandler;
    private final CreateChapterVersionCommandHandler createChapterVersionHandler;
    private final PublishSectionCommandHandler publishSectionHandler;
    private final UpdateSectionCommandHandler updateSectionHandler;
    private final DeleteSectionCommandHandler deleteSectionHandler;
    private final GetSectionQueryHandler getSectionHandler;
    private final GetSectionCurrentVersionQueryHandler getSectionCurrentVersionHandler;
    private final GetSectionPublishedVersionQueryHandler getSectionPublishedVersionHandler;
    private final GetBookCurrentVersionQueryHandler getBookCurrentVersionHandler;
    private final GetChapterCurrentVersionQueryHandler getChapterCurrentVersionHandler;
    private final GetBookVersionHistoryQueryHandler getBookVersionHistoryHandler;
    private final GetChapterVersionHistoryQueryHandler getChapterVersionHistoryHandler;
    private final GetParagraphVersionHistoryQueryHandler getParagraphVersionHistoryHandler;
    private final GetSectionVersionHistoryQueryHandler getSectionVersionHistoryHandler;
    
    public ContentController(
            CreateCategoryCommandHandler createCategoryHandler,
            UpdateCategoryCommandHandler updateCategoryHandler,
            DeleteCategoryCommandHandler deleteCategoryHandler,
            GetCategoryQueryHandler getCategoryHandler,
            GetCategoryByNumberQueryHandler getCategoryByNumberHandler,
            GetAllCategoriesQueryHandler getAllCategoriesHandler,
            GetCategoriesByWheelIdQueryHandler getCategoriesByWheelIdHandler,
            GetAllWheelsQueryHandler getAllWheelsHandler,
            GetWheelByKeyQueryHandler getWheelByKeyHandler,
            CreateBookCommandHandler createBookHandler,
            UpdateBookCommandHandler updateBookHandler,
            DeleteBookCommandHandler deleteBookHandler,
            GetBookQueryHandler getBookHandler,
            GetBooksByCategoryQueryHandler getBooksByCategoryHandler,
            GetPublicBooksByCategoryQueryHandler getPublicBooksByCategoryHandler,
            GetPublicChaptersByBookQueryHandler getPublicChaptersByBookHandler,
            GetPublicSectionsByChapterQueryHandler getPublicSectionsByChapterHandler,
            GetPublicParagraphsBySectionQueryHandler getPublicParagraphsBySectionHandler,
            CreateChapterCommandHandler createChapterHandler,
            UpdateChapterCommandHandler updateChapterHandler,
            DeleteChapterCommandHandler deleteChapterHandler,
            GetChapterQueryHandler getChapterHandler,
            GetChaptersByBookQueryHandler getChaptersByBookHandler,
            GetSectionsByChapterQueryHandler getSectionsByChapterHandler,
            CreateParagraphCommandHandler createParagraphHandler,
            UpdateParagraphCommandHandler updateParagraphHandler,
            DeleteParagraphCommandHandler deleteParagraphHandler,
            GetParagraphQueryHandler getParagraphHandler,
            GetParagraphsBySectionQueryHandler getParagraphsBySectionHandler,
            CreateSectionCommandHandler createSectionHandler,
            CreateSectionVersionCommandHandler createSectionVersionHandler,
            CreateBookVersionCommandHandler createBookVersionHandler,
            CreateChapterVersionCommandHandler createChapterVersionHandler,
            PublishSectionCommandHandler publishSectionHandler,
            UpdateSectionCommandHandler updateSectionHandler,
            DeleteSectionCommandHandler deleteSectionHandler,
            GetSectionQueryHandler getSectionHandler,
            GetSectionCurrentVersionQueryHandler getSectionCurrentVersionHandler,
            GetSectionPublishedVersionQueryHandler getSectionPublishedVersionHandler,
            GetBookCurrentVersionQueryHandler getBookCurrentVersionHandler,
            GetChapterCurrentVersionQueryHandler getChapterCurrentVersionHandler,
            GetBookVersionHistoryQueryHandler getBookVersionHistoryHandler,
            GetChapterVersionHistoryQueryHandler getChapterVersionHistoryHandler,
            GetParagraphVersionHistoryQueryHandler getParagraphVersionHistoryHandler,
            GetSectionVersionHistoryQueryHandler getSectionVersionHistoryHandler) {
        this.createCategoryHandler = createCategoryHandler;
        this.updateCategoryHandler = updateCategoryHandler;
        this.deleteCategoryHandler = deleteCategoryHandler;
        this.getCategoryHandler = getCategoryHandler;
        this.getCategoryByNumberHandler = getCategoryByNumberHandler;
        this.getAllCategoriesHandler = getAllCategoriesHandler;
        this.getCategoriesByWheelIdHandler = getCategoriesByWheelIdHandler;
        this.getAllWheelsHandler = getAllWheelsHandler;
        this.getWheelByKeyHandler = getWheelByKeyHandler;
        this.createBookHandler = createBookHandler;
        this.updateBookHandler = updateBookHandler;
        this.deleteBookHandler = deleteBookHandler;
        this.getBookHandler = getBookHandler;
        this.getBooksByCategoryHandler = getBooksByCategoryHandler;
        this.getPublicBooksByCategoryHandler = getPublicBooksByCategoryHandler;
        this.getPublicChaptersByBookHandler = getPublicChaptersByBookHandler;
        this.getPublicSectionsByChapterHandler = getPublicSectionsByChapterHandler;
        this.getPublicParagraphsBySectionHandler = getPublicParagraphsBySectionHandler;
        this.createChapterHandler = createChapterHandler;
        this.updateChapterHandler = updateChapterHandler;
        this.deleteChapterHandler = deleteChapterHandler;
        this.getChapterHandler = getChapterHandler;
        this.getChaptersByBookHandler = getChaptersByBookHandler;
        this.getSectionsByChapterHandler = getSectionsByChapterHandler;
        this.createParagraphHandler = createParagraphHandler;
        this.updateParagraphHandler = updateParagraphHandler;
        this.deleteParagraphHandler = deleteParagraphHandler;
        this.getParagraphHandler = getParagraphHandler;
        this.getParagraphsBySectionHandler = getParagraphsBySectionHandler;
        this.createSectionHandler = createSectionHandler;
        this.createSectionVersionHandler = createSectionVersionHandler;
        this.createBookVersionHandler = createBookVersionHandler;
        this.createChapterVersionHandler = createChapterVersionHandler;
        this.publishSectionHandler = publishSectionHandler;
        this.updateSectionHandler = updateSectionHandler;
        this.deleteSectionHandler = deleteSectionHandler;
        this.getSectionHandler = getSectionHandler;
        this.getSectionCurrentVersionHandler = getSectionCurrentVersionHandler;
        this.getSectionPublishedVersionHandler = getSectionPublishedVersionHandler;
        this.getBookCurrentVersionHandler = getBookCurrentVersionHandler;
        this.getChapterCurrentVersionHandler = getChapterCurrentVersionHandler;
        this.getBookVersionHistoryHandler = getBookVersionHistoryHandler;
        this.getChapterVersionHistoryHandler = getChapterVersionHistoryHandler;
        this.getParagraphVersionHistoryHandler = getParagraphVersionHistoryHandler;
        this.getSectionVersionHistoryHandler = getSectionVersionHistoryHandler;
    }
    
    // ========== Category Endpoints ==========
    
    /**
     * Create a new category
     * POST /api/v2/content/categories
     */
    @PostMapping("/categories")
    @Transactional
    public ResponseEntity<?> createCategory(
            @Valid @RequestBody CreateCategoryRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            CreateCategoryCommand command = new CreateCategoryCommand(
                request.getTitleNl(),
                request.getTitleEn(),
                request.getDescriptionNl(),
                request.getDescriptionEn()
            );
            
            var result = createCategoryHandler.handle(command);
            CategoryDTO response = toCategoryDTO(result);
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het aanmaken van de category."));
        }
    }
    
    /**
     * Update a category
     * PUT /api/v2/content/categories/{id}
     */
    @PutMapping("/categories/{id}")
    @Transactional
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCategoryRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            UpdateCategoryCommand command = new UpdateCategoryCommand(
                id,
                request.getTitleNl(),
                request.getTitleEn(),
                request.getDescriptionNl(),
                request.getDescriptionEn()
            );
            
            var result = updateCategoryHandler.handle(command);
            CategoryDTO response = toCategoryDTO(result);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het updaten van de category."));
        }
    }
    
    /**
     * Delete a category
     * DELETE /api/v2/content/categories/{id}
     * 
     * Warning: This will cascade delete all books, chapters, sections, and paragraphs in this category!
     */
    @DeleteMapping("/categories/{id}")
    @Transactional
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            DeleteCategoryCommand command = new DeleteCategoryCommand(id);
            deleteCategoryHandler.handle(command);
            
            return ResponseEntity.ok(Map.of("message", "Category and all its content have been successfully deleted."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het verwijderen van de category."));
        }
    }
    
    /**
     * Get all categories
     * GET /api/v2/content/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        GetAllCategoriesQuery query = new GetAllCategoriesQuery();
        List<com.woi.content.application.results.CategoryResult> results = getAllCategoriesHandler.handle(query);
        
        List<CategoryDTO> dtos = results.stream()
            .map(this::toCategoryDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Get categories by wheel ID
     * GET /api/v2/content/categories/wheel/{wheelId}
     */
    @GetMapping("/categories/wheel/{wheelId}")
    public ResponseEntity<List<CategoryDTO>> getCategoriesByWheelId(@PathVariable Long wheelId) {
        GetCategoriesByWheelIdQuery query = new GetCategoriesByWheelIdQuery(wheelId);
        List<com.woi.content.application.results.CategoryResult> results = getCategoriesByWheelIdHandler.handle(query);
        
        List<CategoryDTO> dtos = results.stream()
            .map(this::toCategoryDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    // ========== Wheel Endpoints ==========
    
    /**
     * Get all wheels
     * GET /api/v2/content/wheels
     */
    @GetMapping("/wheels")
    public ResponseEntity<List<WheelDTO>> getAllWheels() {
        GetAllWheelsQuery query = new GetAllWheelsQuery();
        List<com.woi.content.application.results.WheelResult> results = getAllWheelsHandler.handle(query);
        
        List<WheelDTO> dtos = results.stream()
            .map(this::toWheelDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Get wheel by wheel key
     * GET /api/v2/content/wheels/key/{wheelKey}
     */
    @GetMapping("/wheels/key/{wheelKey}")
    public ResponseEntity<WheelDTO> getWheelByKey(@PathVariable String wheelKey) {
        GetWheelByKeyQuery query = new GetWheelByKeyQuery(wheelKey);
        Optional<com.woi.content.application.results.WheelResult> result = getWheelByKeyHandler.handle(query);
        
        return result.map(r -> ResponseEntity.ok(toWheelDTO(r)))
                     .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get category by ID or by category number
     * GET /api/v2/content/categories/{id} - Get by ID
     * GET /api/v2/content/categories/{id}?byNumber=true - Get by category number (where id is the category number)
     */
    @GetMapping("/categories/{id}")
    public ResponseEntity<CategoryDTO> getCategory(
            @PathVariable Long id,
            @RequestParam(required = false) Boolean byNumber) {
        // If byNumber is true, treat id as categoryNumber
        if (Boolean.TRUE.equals(byNumber)) {
            GetCategoryByNumberQuery query = new GetCategoryByNumberQuery(id.intValue());
            Optional<com.woi.content.application.results.CategoryResult> result = getCategoryByNumberHandler.handle(query);
            return result.map(r -> ResponseEntity.ok(toCategoryDTO(r)))
                         .orElse(ResponseEntity.notFound().build());
        }
        
        // Otherwise, treat id as category ID
        GetCategoryQuery query = new GetCategoryQuery(id);
        Optional<com.woi.content.application.results.CategoryResult> result = getCategoryHandler.handle(query);
        
        return result.map(r -> ResponseEntity.ok(toCategoryDTO(r)))
                     .orElse(ResponseEntity.notFound().build());
    }
    
    // ========== Book Endpoints ==========
    
    /**
     * Create a new book
     * POST /api/v2/content/books
     */
    @PostMapping("/books")
    @Transactional
    public ResponseEntity<?> createBook(
            @Valid @RequestBody CreateBookRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            CreateBookCommand command = new CreateBookCommand(request.getCategoryId());
            var result = createBookHandler.handle(command);
            BookDTO response = toBookDTO(result);
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het aanmaken van de book."));
        }
    }
    
    /**
     * Delete a book
     * DELETE /api/v2/content/books/{id}
     * 
     * Warning: This will cascade delete all chapters, sections, and paragraphs in this book!
     */
    @DeleteMapping("/books/{id}")
    @Transactional
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            DeleteBookCommand command = new DeleteBookCommand(id);
            deleteBookHandler.handle(command);
            
            return ResponseEntity.ok(Map.of("message", "Book and all its content have been successfully deleted."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het verwijderen van de book."));
        }
    }
    
    /**
     * Get book by ID
     * GET /api/v2/content/books/{id}
     */
    @GetMapping("/books/{id}")
    public ResponseEntity<BookDTO> getBook(@PathVariable Long id) {
        GetBookQuery query = new GetBookQuery(id);
        Optional<com.woi.content.application.results.BookResult> result = getBookHandler.handle(query);
        
        return result.map(r -> ResponseEntity.ok(toBookDTO(r)))
                     .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get all books in a category
     * GET /api/v2/content/categories/{categoryId}/books - Returns all books (admin)
     * GET /api/v2/content/categories/{categoryId}/books?published=true - Returns only PUBLISHED books (public)
     */
    @GetMapping("/categories/{categoryId}/books")
    public ResponseEntity<List<BookDTO>> getBooksByCategory(
            @PathVariable Long categoryId,
            @RequestParam(required = false) Boolean published) {
        
        List<com.woi.content.application.results.BookResult> results;
        
        if (Boolean.TRUE.equals(published)) {
            // Use public handler to filter for PUBLISHED books only
            GetPublicBooksByCategoryQuery query = new GetPublicBooksByCategoryQuery(categoryId);
            results = getPublicBooksByCategoryHandler.handle(query);
        } else {
            // Use normal handler to return all books
            GetBooksByCategoryQuery query = new GetBooksByCategoryQuery(categoryId);
            results = getBooksByCategoryHandler.handle(query);
        }
        
        List<BookDTO> dtos = results.stream()
            .map(this::toBookDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Update a book
     * PUT /api/v2/content/books/{id}
     */
    @PutMapping("/books/{id}")
    @Transactional
    public ResponseEntity<?> updateBook(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBookRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            UpdateBookCommand command = new UpdateBookCommand(
                id,
                request.getBookNumber()
            );
            
            var result = updateBookHandler.handle(command);
            BookDTO response = toBookDTO(result);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het updaten van de book."));
        }
    }
    
    // ========== Chapter Endpoints ==========
    
    /**
     * Create a new chapter
     * POST /api/v2/content/chapters
     */
    @PostMapping("/chapters")
    @Transactional
    public ResponseEntity<?> createChapter(
            @Valid @RequestBody CreateChapterRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            CreateChapterCommand command = new CreateChapterCommand(
                request.getBookId(),
                request.getPosition()
            );
            var result = createChapterHandler.handle(command);
            ChapterDTO response = toChapterDTO(result);
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het aanmaken van de chapter."));
        }
    }
    
    /**
     * Get chapter by ID
     * GET /api/v2/content/chapters/{id}
     */
    @GetMapping("/chapters/{id}")
    public ResponseEntity<ChapterDTO> getChapter(@PathVariable Long id) {
        GetChapterQuery query = new GetChapterQuery(id);
        Optional<com.woi.content.application.results.ChapterResult> result = getChapterHandler.handle(query);
        
        return result.map(r -> ResponseEntity.ok(toChapterDTO(r)))
                     .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get all chapters in a book
     * GET /api/v2/content/books/{bookId}/chapters - Returns all chapters (admin)
     * GET /api/v2/content/books/{bookId}/chapters?published=true - Returns only PUBLISHED chapters (public)
     */
    @GetMapping("/books/{bookId}/chapters")
    public ResponseEntity<List<ChapterDTO>> getChaptersByBook(
            @PathVariable Long bookId,
            @RequestParam(required = false) Boolean published) {
        
        List<com.woi.content.application.results.ChapterResult> results;
        
        if (Boolean.TRUE.equals(published)) {
            // Use public handler to filter for PUBLISHED chapters only
            GetPublicChaptersByBookQuery query = new GetPublicChaptersByBookQuery(bookId);
            results = getPublicChaptersByBookHandler.handle(query);
        } else {
            // Use normal handler to return all chapters
            GetChaptersByBookQuery query = new GetChaptersByBookQuery(bookId);
            results = getChaptersByBookHandler.handle(query);
        }
        
        List<ChapterDTO> dtos = results.stream()
            .map(this::toChapterDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Get all sections in a chapter
     * GET /api/v2/content/chapters/{chapterId}/sections - Returns all sections (admin)
     * GET /api/v2/content/chapters/{chapterId}/sections?published=true - Returns only PUBLISHED sections (public)
     */
    @GetMapping("/chapters/{chapterId}/sections")
    public ResponseEntity<List<SectionDTO>> getSectionsByChapter(
            @PathVariable Long chapterId,
            @RequestParam(required = false) Boolean published) {
        
        List<com.woi.content.application.results.SectionResult> results;
        
        if (Boolean.TRUE.equals(published)) {
            // Use public handler to filter for PUBLISHED sections only
            GetPublicSectionsByChapterQuery query = new GetPublicSectionsByChapterQuery(chapterId);
            results = getPublicSectionsByChapterHandler.handle(query);
        } else {
            // Use normal handler to return all sections
            GetSectionsByChapterQuery query = new GetSectionsByChapterQuery(chapterId);
            results = getSectionsByChapterHandler.handle(query);
        }
        
        List<SectionDTO> dtos = results.stream()
            .map(this::toSectionDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Update a chapter
     * PUT /api/v2/content/chapters/{id}
     */
    @PutMapping("/chapters/{id}")
    @Transactional
    public ResponseEntity<?> updateChapter(
            @PathVariable Long id,
            @Valid @RequestBody UpdateChapterRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            UpdateChapterCommand command = new UpdateChapterCommand(
                id,
                request.getChapterNumber(),
                request.getPosition()
            );
            
            var result = updateChapterHandler.handle(command);
            ChapterDTO response = toChapterDTO(result);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het updaten van de chapter."));
        }
    }
    
    /**
     * Delete a chapter
     * DELETE /api/v2/content/chapters/{id}
     * 
     * Warning: This will cascade delete all sections and paragraphs in this chapter!
     */
    @DeleteMapping("/chapters/{id}")
    @Transactional
    public ResponseEntity<?> deleteChapter(@PathVariable Long id) {
        try {
            DeleteChapterCommand command = new DeleteChapterCommand(id);
            deleteChapterHandler.handle(command);
            
            return ResponseEntity.ok(Map.of("message", "Chapter and all its content have been successfully deleted."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het verwijderen van de chapter."));
        }
    }
    
    // ========== Paragraph Endpoints ==========
    
    /**
     * Create a new paragraph
     * POST /api/v2/content/paragraphs
     */
    @PostMapping("/paragraphs")
    @Transactional
    public ResponseEntity<?> createParagraph(
            @Valid @RequestBody CreateParagraphRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            CreateParagraphCommand command = new CreateParagraphCommand(
                request.getSectionId(),
                request.getParagraphNumber()
            );
            var result = createParagraphHandler.handle(command);
            ParagraphDTO response = toParagraphDTO(result);
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het aanmaken van de paragraph."));
        }
    }
    
    /**
     * Get paragraph by ID
     * GET /api/v2/content/paragraphs/{id}
     */
    @GetMapping("/paragraphs/{id}")
    public ResponseEntity<ParagraphDTO> getParagraph(@PathVariable Long id) {
        GetParagraphQuery query = new GetParagraphQuery(id);
        Optional<com.woi.content.application.results.ParagraphResult> result = getParagraphHandler.handle(query);
        
        return result.map(r -> ResponseEntity.ok(toParagraphDTO(r)))
                     .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get all paragraphs in a section
     * GET /api/v2/content/sections/{sectionId}/paragraphs - Returns all paragraphs (admin)
     * GET /api/v2/content/sections/{sectionId}/paragraphs?published=true - Returns only PUBLISHED paragraphs (public)
     */
    @GetMapping("/sections/{sectionId}/paragraphs")
    public ResponseEntity<List<ParagraphDTO>> getParagraphsBySection(
            @PathVariable Long sectionId,
            @RequestParam(required = false) Boolean published) {
        
        List<com.woi.content.application.results.ParagraphResult> results;
        
        if (Boolean.TRUE.equals(published)) {
            // Use public handler to filter for PUBLISHED paragraphs only
            GetPublicParagraphsBySectionQuery query = new GetPublicParagraphsBySectionQuery(sectionId);
            results = getPublicParagraphsBySectionHandler.handle(query);
        } else {
            // Use normal handler to return all paragraphs
            GetParagraphsBySectionQuery query = new GetParagraphsBySectionQuery(sectionId);
            results = getParagraphsBySectionHandler.handle(query);
        }
        
        List<ParagraphDTO> dtos = results.stream()
            .map(this::toParagraphDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Update a paragraph
     * PUT /api/v2/content/paragraphs/{id}
     */
    @PutMapping("/paragraphs/{id}")
    @Transactional
    public ResponseEntity<?> updateParagraph(
            @PathVariable Long id,
            @Valid @RequestBody UpdateParagraphRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            UpdateParagraphCommand command = new UpdateParagraphCommand(
                id,
                request.getParagraphNumber()
            );
            
            var result = updateParagraphHandler.handle(command);
            ParagraphDTO response = toParagraphDTO(result);
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het updaten van de paragraph."));
        }
    }
    
    /**
     * Delete a paragraph
     * DELETE /api/v2/content/paragraphs/{id}
     * 
     * Note: Before deleting, the system checks if the paragraph is used in Learning module.
     * If it is, the delete operation will fail.
     */
    @DeleteMapping("/paragraphs/{id}")
    @Transactional
    public ResponseEntity<?> deleteParagraph(@PathVariable Long id) {
        try {
            DeleteParagraphCommand command = new DeleteParagraphCommand(id);
            deleteParagraphHandler.handle(command);
            
            return ResponseEntity.ok(Map.of("message", "Paragraph has been successfully deleted."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het verwijderen van de paragraph."));
        }
    }
    
    // ========== Section Endpoints ==========
    
    /**
     * Create a new section
     * POST /api/v2/content/sections
     */
    @PostMapping("/sections")
    @Transactional
    public ResponseEntity<?> createSection(
            @Valid @RequestBody CreateSectionRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            CreateSectionCommand command = new CreateSectionCommand(
                request.getChapterId(),
                request.getOrderIndex()
            );
            
            var result = createSectionHandler.handle(command);
            SectionDTO response = toSectionDTO(result);
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het aanmaken van de section."));
        }
    }
    
    /**
     * Create a new section version
     * POST /api/v2/content/sections/{sectionId}/versions
     */
    @PostMapping("/sections/{sectionId}/versions")
    @Transactional
    public ResponseEntity<?> createSectionVersion(
            @PathVariable Long sectionId,
            @Valid @RequestBody CreateSectionVersionRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            CreateSectionVersionCommand command = new CreateSectionVersionCommand(
                sectionId,
                request.getTitleEn(),
                request.getTitleNl(),
                request.getIntroEn(),
                request.getIntroNl(),
                request.getUserId()
            );
            
            var result = createSectionVersionHandler.handle(command);
            SectionVersionDTO response = toSectionVersionDTO(result);
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het aanmaken van de section version."));
        }
    }
    
    /**
     * Create a new book version
     * POST /api/v2/content/books/{bookId}/versions
     */
    @PostMapping("/books/{bookId}/versions")
    @Transactional
    public ResponseEntity<?> createBookVersion(
            @PathVariable Long bookId,
            @Valid @RequestBody CreateBookVersionRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            CreateBookVersionCommand command = new CreateBookVersionCommand(
                bookId,
                request.getTitleEn(),
                request.getTitleNl(),
                request.getIntroEn(),
                request.getIntroNl(),
                request.getUserId()
            );
            
            var result = createBookVersionHandler.handle(command);
            BookVersionDTO response = toBookVersionDTO(result);
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het aanmaken van de book version."));
        }
    }
    
    /**
     * Create a new chapter version
     * POST /api/v2/content/chapters/{chapterId}/versions
     */
    @PostMapping("/chapters/{chapterId}/versions")
    @Transactional
    public ResponseEntity<?> createChapterVersion(
            @PathVariable Long chapterId,
            @Valid @RequestBody CreateChapterVersionRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            CreateChapterVersionCommand command = new CreateChapterVersionCommand(
                chapterId,
                request.getTitleEn(),
                request.getTitleNl(),
                request.getIntroEn(),
                request.getIntroNl(),
                request.getUserId()
            );
            
            var result = createChapterVersionHandler.handle(command);
            ChapterVersionDTO response = toChapterVersionDTO(result);
            
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het aanmaken van de chapter version."));
        }
    }
    
    /**
     * Publish a section
     * POST /api/v2/content/sections/{sectionId}/publish
     */
    @PostMapping("/sections/{sectionId}/publish")
    @Transactional
    public ResponseEntity<?> publishSection(
            @PathVariable Long sectionId,
            @Valid @RequestBody PublishSectionRequestDTO request,
            BindingResult bindingResult) {
        try {
            if (bindingResult.hasErrors()) {
                String errorMessage = bindingResult.getFieldErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .findFirst()
                    .orElse("Ongeldige invoer");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", errorMessage));
            }
            
            PublishSectionCommand command = new PublishSectionCommand(
                sectionId,
                request.getUserId()
            );
            
            publishSectionHandler.handle(command);
            
            return ResponseEntity.ok(Map.of("message", "Section is succesvol gepubliceerd."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het publiceren van de section."));
        }
    }
    
    /**
     * Get section by ID
     * GET /api/v2/content/sections/{id}
     */
    @GetMapping("/sections/{id}")
    public ResponseEntity<SectionDTO> getSection(@PathVariable Long id) {
        GetSectionQuery query = new GetSectionQuery(id);
        Optional<com.woi.content.application.results.SectionResult> result = getSectionHandler.handle(query);
        
        return result.map(r -> ResponseEntity.ok(toSectionDTO(r)))
                     .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get current (working) version of a section
     * GET /api/v2/content/sections/{id}/versions/current
     */
    @GetMapping("/sections/{id}/versions/current")
    public ResponseEntity<SectionVersionDTO> getSectionCurrentVersion(@PathVariable Long id) {
        GetSectionCurrentVersionQuery query = new GetSectionCurrentVersionQuery(id);
        Optional<com.woi.content.application.results.SectionVersionResult> result = 
            getSectionCurrentVersionHandler.handle(query);
        
        return result.map(r -> ResponseEntity.ok(toSectionVersionDTO(r)))
                     .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get published version of a section
     * GET /api/v2/content/sections/{id}/versions/published
     */
    @GetMapping("/sections/{id}/versions/published")
    public ResponseEntity<SectionVersionDTO> getSectionPublishedVersion(@PathVariable Long id) {
        GetSectionPublishedVersionQuery query = new GetSectionPublishedVersionQuery(id);
        Optional<com.woi.content.application.results.SectionVersionResult> result = 
            getSectionPublishedVersionHandler.handle(query);
        
        return result.map(r -> ResponseEntity.ok(toSectionVersionDTO(r)))
                     .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get current (working) version of a book
     * GET /api/v2/content/books/{id}/versions/current
     */
    @GetMapping("/books/{id}/versions/current")
    public ResponseEntity<BookVersionDTO> getBookCurrentVersion(@PathVariable Long id) {
        GetBookCurrentVersionQuery query = new GetBookCurrentVersionQuery(id);
        Optional<com.woi.content.application.results.BookVersionResult> result = 
            getBookCurrentVersionHandler.handle(query);
        
        return result.map(r -> ResponseEntity.ok(toBookVersionDTO(r)))
                     .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Get current (working) version of a chapter
     * GET /api/v2/content/chapters/{id}/versions/current
     */
    @GetMapping("/chapters/{id}/versions/current")
    public ResponseEntity<ChapterVersionDTO> getChapterCurrentVersion(@PathVariable Long id) {
        GetChapterCurrentVersionQuery query = new GetChapterCurrentVersionQuery(id);
        Optional<com.woi.content.application.results.ChapterVersionResult> result = 
            getChapterCurrentVersionHandler.handle(query);
        
        return result.map(r -> ResponseEntity.ok(toChapterVersionDTO(r)))
                     .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Delete a section
     * DELETE /api/v2/content/sections/{id}
     * 
     * Warning: This will cascade delete all paragraphs in this section!
     */
    @DeleteMapping("/sections/{id}")
    @Transactional
    public ResponseEntity<?> deleteSection(@PathVariable Long id) {
        try {
            DeleteSectionCommand command = new DeleteSectionCommand(id);
            deleteSectionHandler.handle(command);
            
            return ResponseEntity.ok(Map.of("message", "Section and all its paragraphs have been successfully deleted."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Er is een fout opgetreden bij het verwijderen van de section."));
        }
    }
    
    // ========== Version History Endpoints ==========
    
    /**
     * Get version history for a book
     * GET /api/v2/content/books/{bookId}/versions
     */
    @GetMapping("/books/{bookId}/versions")
    public ResponseEntity<List<BookVersionDTO>> getBookVersionHistory(@PathVariable Long bookId) {
        GetBookVersionHistoryQuery query = new GetBookVersionHistoryQuery(bookId);
        List<com.woi.content.application.results.BookVersionResult> results = getBookVersionHistoryHandler.handle(query);
        
        List<BookVersionDTO> dtos = results.stream()
            .map(this::toBookVersionDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Get version history for a chapter
     * GET /api/v2/content/chapters/{chapterId}/versions
     */
    @GetMapping("/chapters/{chapterId}/versions")
    public ResponseEntity<List<ChapterVersionDTO>> getChapterVersionHistory(@PathVariable Long chapterId) {
        GetChapterVersionHistoryQuery query = new GetChapterVersionHistoryQuery(chapterId);
        List<com.woi.content.application.results.ChapterVersionResult> results = getChapterVersionHistoryHandler.handle(query);
        
        List<ChapterVersionDTO> dtos = results.stream()
            .map(this::toChapterVersionDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Get version history for a paragraph
     * GET /api/v2/content/paragraphs/{id}/versions
     */
    @GetMapping("/paragraphs/{id}/versions")
    public ResponseEntity<List<ParagraphVersionDTO>> getParagraphVersionHistory(@PathVariable Long id) {
        GetParagraphVersionHistoryQuery query = new GetParagraphVersionHistoryQuery(id);
        List<com.woi.content.application.results.ParagraphVersionResult> results = getParagraphVersionHistoryHandler.handle(query);
        
        List<ParagraphVersionDTO> dtos = results.stream()
            .map(this::toParagraphVersionDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Get version history for a section
     * GET /api/v2/content/sections/{id}/versions
     */
    @GetMapping("/sections/{id}/versions")
    public ResponseEntity<List<SectionVersionDTO>> getSectionVersionHistory(@PathVariable Long id) {
        GetSectionVersionHistoryQuery query = new GetSectionVersionHistoryQuery(id);
        List<com.woi.content.application.results.SectionVersionResult> results = getSectionVersionHistoryHandler.handle(query);
        
        List<SectionVersionDTO> dtos = results.stream()
            .map(this::toSectionVersionDTO)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(dtos);
    }
    
    // Mapper methods
    private CategoryDTO toCategoryDTO(com.woi.content.application.results.CategoryResult result) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(result.id());
        dto.setCategoryNumber(result.categoryNumber());
        dto.setWheelId(result.wheelId());
        dto.setTitleNl(result.titleNl());
        dto.setTitleEn(result.titleEn());
        dto.setSubtitleNl(result.subtitleNl());
        dto.setSubtitleEn(result.subtitleEn());
        dto.setDescriptionNl(result.descriptionNl());
        dto.setDescriptionEn(result.descriptionEn());
        dto.setCreatedAt(result.createdAt());
        dto.setUpdatedAt(result.updatedAt());
        return dto;
    }
    
    private WheelDTO toWheelDTO(com.woi.content.application.results.WheelResult result) {
        WheelDTO dto = new WheelDTO();
        dto.setId(result.id());
        dto.setWheelKey(result.wheelKey());
        dto.setNameNl(result.nameNl());
        dto.setNameEn(result.nameEn());
        dto.setDescriptionNl(result.descriptionNl());
        dto.setDescriptionEn(result.descriptionEn());
        dto.setDisplayOrder(result.displayOrder());
        dto.setCreatedAt(result.createdAt());
        return dto;
    }
    
    private BookDTO toBookDTO(com.woi.content.application.results.BookResult result) {
        BookDTO dto = new BookDTO();
        dto.setId(result.id());
        dto.setCategoryId(result.categoryId());
        dto.setBookNumber(result.bookNumber());
        dto.setWorkingStatusBookVersionId(result.workingStatusBookVersionId());
        dto.setCreatedAt(result.createdAt());
        dto.setUpdatedAt(result.updatedAt());
        return dto;
    }
    
    private ChapterDTO toChapterDTO(com.woi.content.application.results.ChapterResult result) {
        ChapterDTO dto = new ChapterDTO();
        dto.setId(result.id());
        dto.setBookId(result.bookId());
        dto.setChapterNumber(result.chapterNumber());
        dto.setPosition(result.position());
        dto.setWorkingStatusChapterVersionId(result.workingStatusChapterVersionId());
        dto.setCreatedAt(result.createdAt());
        dto.setUpdatedAt(result.updatedAt());
        return dto;
    }
    
    private ParagraphDTO toParagraphDTO(com.woi.content.application.results.ParagraphResult result) {
        ParagraphDTO dto = new ParagraphDTO();
        dto.setId(result.id());
        dto.setSectionId(result.sectionId());
        dto.setParagraphNumber(result.paragraphNumber());
        dto.setWorkingStatusParagraphVersionId(result.workingStatusParagraphVersionId());
        dto.setCreatedAt(result.createdAt());
        dto.setUpdatedAt(result.updatedAt());
        return dto;
    }
    
    private SectionDTO toSectionDTO(com.woi.content.application.results.SectionResult result) {
        SectionDTO dto = new SectionDTO();
        dto.setId(result.id());
        dto.setChapterId(result.chapterId());
        dto.setOrderIndex(result.orderIndex());
        dto.setWorkingStatusSectionVersionId(result.workingStatusSectionVersionId());
        dto.setCreatedAt(result.createdAt());
        dto.setUpdatedAt(result.updatedAt());
        return dto;
    }
    
    private SectionVersionDTO toSectionVersionDTO(com.woi.content.application.results.SectionVersionResult result) {
        SectionVersionDTO dto = new SectionVersionDTO();
        dto.setId(result.id());
        dto.setSectionId(result.sectionId());
        dto.setVersionNumber(result.versionNumber());
        dto.setTitleEn(result.titleEn());
        dto.setTitleNl(result.titleNl());
        dto.setIntroEn(result.introEn());
        dto.setIntroNl(result.introNl());
        dto.setCreatedBy(result.createdBy());
        dto.setCreatedAt(result.createdAt());
        return dto;
    }
    
    private BookVersionDTO toBookVersionDTO(com.woi.content.application.results.BookVersionResult result) {
        BookVersionDTO dto = new BookVersionDTO();
        dto.setId(result.id());
        dto.setBookId(result.bookId());
        dto.setVersionNumber(result.versionNumber());
        dto.setTitleEn(result.titleEn());
        dto.setTitleNl(result.titleNl());
        dto.setIntroEn(result.introEn());
        dto.setIntroNl(result.introNl());
        dto.setCreatedBy(result.createdBy());
        dto.setCreatedAt(result.createdAt());
        return dto;
    }
    
    private ChapterVersionDTO toChapterVersionDTO(com.woi.content.application.results.ChapterVersionResult result) {
        ChapterVersionDTO dto = new ChapterVersionDTO();
        dto.setId(result.id());
        dto.setChapterId(result.chapterId());
        dto.setVersionNumber(result.versionNumber());
        dto.setTitleEn(result.titleEn());
        dto.setTitleNl(result.titleNl());
        dto.setIntroEn(result.introEn());
        dto.setIntroNl(result.introNl());
        dto.setCreatedBy(result.createdBy());
        dto.setCreatedAt(result.createdAt());
        return dto;
    }
    
    private ParagraphVersionDTO toParagraphVersionDTO(com.woi.content.application.results.ParagraphVersionResult result) {
        ParagraphVersionDTO dto = new ParagraphVersionDTO();
        dto.setId(result.id());
        dto.setParagraphId(result.paragraphId());
        dto.setVersionNumber(result.versionNumber());
        dto.setTitleEn(result.titleEn());
        dto.setTitleNl(result.titleNl());
        dto.setContentEn(result.contentEn());
        dto.setContentNl(result.contentNl());
        dto.setCreatedBy(result.createdBy());
        dto.setCreatedAt(result.createdAt());
        return dto;
    }
}


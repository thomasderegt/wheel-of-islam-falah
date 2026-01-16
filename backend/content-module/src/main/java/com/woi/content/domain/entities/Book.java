package com.woi.content.domain.entities;

import java.time.LocalDateTime;

/**
 * Book domain entity - Pure POJO (no JPA annotations)
 * Represents a book within a category (structural metadata only)
 * Content (title, intro) is in BookVersion (v2 - not implemented yet)
 */
public class Book {
    private Long id;
    private Long categoryId;  // Soft reference (no direct Category entity dependency)
    private Integer bookNumber;  // Optional (for stable codes like CAT01-B03)
    private Long workingStatusBookVersionId;  // Pointer to current working version (v2 - not used in v1)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Public constructor for mappers (infrastructure layer)
    public Book() {}
    
    /**
     * Factory method: Create a new book with structural metadata only
     * 
     * @param categoryId Category ID (must not be null)
     * @return New Book instance
     * @throws IllegalArgumentException if categoryId is null
     */
    public static Book create(Long categoryId) {
        if (categoryId == null) {
            throw new IllegalArgumentException("Category ID cannot be null");
        }
        
        Book book = new Book();
        book.categoryId = categoryId;
        book.createdAt = LocalDateTime.now();
        book.updatedAt = LocalDateTime.now();
        book.workingStatusBookVersionId = null;
        
        return book;
    }
    
    /**
     * Set book number
     * 
     * @param bookNumber Book number (must be positive if not null)
     * @throws IllegalArgumentException if bookNumber is invalid
     */
    public void setBookNumber(Integer bookNumber) {
        if (bookNumber != null && bookNumber < 1) {
            throw new IllegalArgumentException("Book number must be a positive integer");
        }
        this.bookNumber = bookNumber;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Set working status book version ID
     * Called by handlers to update the current working version pointer (v2)
     * 
     * @param versionId Version ID (can be null)
     */
    public void setWorkingStatusBookVersionId(Long versionId) {
        this.workingStatusBookVersionId = versionId;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getCategoryId() { return categoryId; }
    public Integer getBookNumber() { return bookNumber; }
    public Long getWorkingStatusBookVersionId() { return workingStatusBookVersionId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    /**
     * Setter for ID - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setId(Long id) { this.id = id; }
    
    /**
     * Setter for createdAt - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    /**
     * Setter for updatedAt - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    
    /**
     * Setter for categoryId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    
    /**
     * Setter for bookNumber - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use setBookNumber() method instead
     */
    public void setBookNumberInternal(Integer bookNumber) { this.bookNumber = bookNumber; }
    
    /**
     * Get entity type for ContentStatus lookup
     * 
     * @return Entity type string
     */
    public String getEntityTypeForStatus() {
        return "book";
    }
}


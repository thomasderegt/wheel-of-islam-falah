package com.woi.content.domain.entities;

import java.time.LocalDateTime;

/**
 * Chapter domain entity - Pure POJO (no JPA annotations)
 * Represents a chapter within a book (structural metadata only)
 * Content (title, description) is in ChapterVersion (v2 - not implemented yet)
 * 
 * Business logic:
 * - Position validatie (0 = center, 1-10 = circular)
 * - Book validatie (moet niet null zijn)
 */
public class Chapter {
    // Business constants
    public static final int CENTER_POSITION = 0;
    public static final int MIN_CIRCULAR_POSITION = 1;
    public static final int MAX_CIRCULAR_POSITION = 10;
    
    private Long id;
    private Long bookId;  // Soft reference (no direct Book entity dependency)
    private Integer chapterNumber;  // Optional (for stable codes)
    private Integer position;  // 0 (center) or 1-10 (circular positions)
    private Long workingStatusChapterVersionId;  // Pointer to current working version (v2 - not used in v1)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Public constructor for mappers (infrastructure layer)
    public Chapter() {}
    
    /**
     * Factory method: Create a new chapter with structural metadata only
     * 
     * @param bookId Book ID (must not be null)
     * @param position Position (0 = center, 1-10 = circular, default = 0)
     * @return New Chapter instance
     * @throws IllegalArgumentException if bookId is null or position is invalid
     */
    public static Chapter create(Long bookId, Integer position) {
        if (bookId == null) {
            throw new IllegalArgumentException("Book ID cannot be null");
        }
        
        // Position validatie
        int pos = (position != null) ? position : CENTER_POSITION;
        if (!isValidPosition(pos)) {
            throw new IllegalArgumentException(
                "Invalid position: " + pos + ". Position must be 0 (center) or 1-10 (circular)"
            );
        }
        
        Chapter chapter = new Chapter();
        chapter.bookId = bookId;
        chapter.position = pos;
        chapter.createdAt = LocalDateTime.now();
        chapter.updatedAt = LocalDateTime.now();
        chapter.workingStatusChapterVersionId = null;
        
        return chapter;
    }
    
    /**
     * Valideert of een position geldig is
     * 
     * @param position Position om te valideren
     * @return true als position geldig is (0 of 1-10)
     */
    public static boolean isValidPosition(int position) {
        return position == CENTER_POSITION || 
               (position >= MIN_CIRCULAR_POSITION && position <= MAX_CIRCULAR_POSITION);
    }
    
    /**
     * Controleert of deze chapter een center position heeft
     * 
     * @return true als position = 0
     */
    public boolean isCenterPosition() {
        return position == CENTER_POSITION;
    }
    
    /**
     * Controleert of deze chapter een circular position heeft
     * 
     * @return true als position tussen 1-10 is
     */
    public boolean isCircularPosition() {
        return position >= MIN_CIRCULAR_POSITION && position <= MAX_CIRCULAR_POSITION;
    }
    
    /**
     * Update position met validatie
     * 
     * @param position Nieuwe position
     * @throws IllegalArgumentException als position ongeldig is
     */
    public void updatePosition(int position) {
        if (!isValidPosition(position)) {
            throw new IllegalArgumentException(
                "Invalid position: " + position + ". Position must be 0 (center) or 1-10 (circular)"
            );
        }
        this.position = position;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Set chapter number
     * 
     * @param chapterNumber Chapter number (must be positive if not null)
     * @throws IllegalArgumentException if chapterNumber is invalid
     */
    public void setChapterNumber(Integer chapterNumber) {
        if (chapterNumber != null && chapterNumber < 1) {
            throw new IllegalArgumentException("Chapter number must be a positive integer");
        }
        this.chapterNumber = chapterNumber;
        this.updatedAt = LocalDateTime.now();
    }
    
    /**
     * Set working status chapter version ID
     * Called by handlers to update the current working version pointer (v2)
     * 
     * @param versionId Version ID (can be null)
     */
    public void setWorkingStatusChapterVersionId(Long versionId) {
        this.workingStatusChapterVersionId = versionId;
        this.updatedAt = LocalDateTime.now();
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getBookId() { return bookId; }
    public Integer getChapterNumber() { return chapterNumber; }
    public Integer getPosition() { return position; }
    public Long getWorkingStatusChapterVersionId() { return workingStatusChapterVersionId; }
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
     * Setter for bookId - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - this is for persistence mapping only
     */
    public void setBookId(Long bookId) { this.bookId = bookId; }
    
    /**
     * Setter for position - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use updatePosition() method instead
     */
    public void setPositionInternal(Integer position) { this.position = position; }
    
    /**
     * Setter for chapterNumber - ONLY for entity mapping (infrastructure layer)
     * DO NOT use in business logic - use setChapterNumber() method instead
     */
    public void setChapterNumberInternal(Integer chapterNumber) { this.chapterNumber = chapterNumber; }
    
    /**
     * Get entity type for ContentStatus lookup
     * 
     * @return Entity type string
     */
    public String getEntityTypeForStatus() {
        return "chapter";
    }
}


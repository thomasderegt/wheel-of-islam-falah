package com.woi.content.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for Book (database mapping)
 */
@Entity
@Table(name = "books", schema = "content")
public class BookJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "category_id", nullable = false)
    private Long categoryId;
    
    @Column(name = "book_number")
    private Integer bookNumber;
    
    @Column(name = "working_status_bookversion_id")
    private Long workingStatusBookVersionId;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Public constructor for mappers
    public BookJpaEntity() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    
    public Integer getBookNumber() { return bookNumber; }
    public void setBookNumber(Integer bookNumber) { this.bookNumber = bookNumber; }
    
    public Long getWorkingStatusBookVersionId() { return workingStatusBookVersionId; }
    public void setWorkingStatusBookVersionId(Long workingStatusBookVersionId) {
        this.workingStatusBookVersionId = workingStatusBookVersionId;
    }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}


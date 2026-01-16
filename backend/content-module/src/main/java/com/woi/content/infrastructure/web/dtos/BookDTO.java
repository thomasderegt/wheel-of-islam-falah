package com.woi.content.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for Book response
 */
public class BookDTO {
    private Long id;
    private Long categoryId;
    private Integer bookNumber;
    private Long workingStatusBookVersionId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
    
    public Integer getBookNumber() {
        return bookNumber;
    }
    
    public void setBookNumber(Integer bookNumber) {
        this.bookNumber = bookNumber;
    }
    
    public Long getWorkingStatusBookVersionId() {
        return workingStatusBookVersionId;
    }
    
    public void setWorkingStatusBookVersionId(Long workingStatusBookVersionId) {
        this.workingStatusBookVersionId = workingStatusBookVersionId;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}


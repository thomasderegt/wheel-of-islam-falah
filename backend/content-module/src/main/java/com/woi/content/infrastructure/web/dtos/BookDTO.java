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
    private String titleEn;
    private String titleNl;
    
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

    public String getTitleEn() {
        return titleEn;
    }

    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }

    public String getTitleNl() {
        return titleNl;
    }

    public void setTitleNl(String titleNl) {
        this.titleNl = titleNl;
    }
}


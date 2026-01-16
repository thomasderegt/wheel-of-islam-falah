package com.woi.content.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;

/**
 * DTO for creating a book
 */
public class CreateBookRequestDTO {
    
    @NotNull(message = "Category ID is verplicht")
    private Long categoryId;
    
    public Long getCategoryId() {
        return categoryId;
    }
    
    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}


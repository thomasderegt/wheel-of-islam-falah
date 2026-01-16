package com.woi.content.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;

/**
 * DTO for creating a chapter
 */
public class CreateChapterRequestDTO {
    
    @NotNull(message = "Book ID is verplicht")
    private Long bookId;
    
    private Integer position;  // 0 = center, 1-10 = circular (default = 0)
    
    public Long getBookId() {
        return bookId;
    }
    
    public void setBookId(Long bookId) {
        this.bookId = bookId;
    }
    
    public Integer getPosition() {
        return position;
    }
    
    public void setPosition(Integer position) {
        this.position = position;
    }
}


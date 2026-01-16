package com.woi.content.infrastructure.web.dtos;

/**
 * DTO for updating a book
 */
public class UpdateBookRequestDTO {
    
    private Integer bookNumber;
    
    public Integer getBookNumber() {
        return bookNumber;
    }
    
    public void setBookNumber(Integer bookNumber) {
        this.bookNumber = bookNumber;
    }
}


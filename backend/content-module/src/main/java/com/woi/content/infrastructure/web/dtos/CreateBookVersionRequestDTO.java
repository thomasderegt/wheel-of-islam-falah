package com.woi.content.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;

/**
 * DTO for creating a book version
 * Note: bookId comes from path variable, not from request body
 */
public class CreateBookVersionRequestDTO {
    
    // bookId is not required in body - it comes from path variable
    private Long bookId;
    
    private String titleEn;
    private String titleNl;
    private String introEn;
    private String introNl;
    
    @NotNull(message = "User ID is verplicht")
    private Long userId;
    
    public Long getBookId() {
        return bookId;
    }
    
    public void setBookId(Long bookId) {
        this.bookId = bookId;
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
    
    public String getIntroEn() {
        return introEn;
    }
    
    public void setIntroEn(String introEn) {
        this.introEn = introEn;
    }
    
    public String getIntroNl() {
        return introNl;
    }
    
    public void setIntroNl(String introNl) {
        this.introNl = introNl;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
}


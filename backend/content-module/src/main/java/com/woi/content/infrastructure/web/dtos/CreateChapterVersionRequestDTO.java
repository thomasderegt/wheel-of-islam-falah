package com.woi.content.infrastructure.web.dtos;

import jakarta.validation.constraints.NotNull;

/**
 * DTO for creating a chapter version
 * Note: chapterId comes from path variable, not from request body
 */
public class CreateChapterVersionRequestDTO {
    
    // chapterId is not required in body - it comes from path variable
    private Long chapterId;
    
    private String titleEn;
    private String titleNl;
    private String introEn;
    private String introNl;
    
    @NotNull(message = "User ID is verplicht")
    private Long userId;
    
    public Long getChapterId() {
        return chapterId;
    }
    
    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
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


package com.woi.content.infrastructure.web.dtos;

/**
 * DTO for updating a chapter
 */
public class UpdateChapterRequestDTO {
    
    private Integer chapterNumber;
    private Integer position;
    
    public Integer getChapterNumber() {
        return chapterNumber;
    }
    
    public void setChapterNumber(Integer chapterNumber) {
        this.chapterNumber = chapterNumber;
    }
    
    public Integer getPosition() {
        return position;
    }
    
    public void setPosition(Integer position) {
        this.position = position;
    }
}


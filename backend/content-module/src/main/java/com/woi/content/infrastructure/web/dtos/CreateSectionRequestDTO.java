package com.woi.content.infrastructure.web.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for creating a section
 */
public class CreateSectionRequestDTO {
    
    @NotNull(message = "Chapter ID is verplicht")
    private Long chapterId;
    
    @NotNull(message = "Order index is verplicht")
    @Min(value = 0, message = "Order index moet niet-negatief zijn")
    private Integer orderIndex;
    
    public Long getChapterId() {
        return chapterId;
    }
    
    public void setChapterId(Long chapterId) {
        this.chapterId = chapterId;
    }
    
    public Integer getOrderIndex() {
        return orderIndex;
    }
    
    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}


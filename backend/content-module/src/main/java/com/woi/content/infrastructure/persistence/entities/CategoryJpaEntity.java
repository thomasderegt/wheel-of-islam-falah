package com.woi.content.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for Category (database mapping)
 */
@Entity
@Table(name = "categories", schema = "content")
public class CategoryJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "category_number")
    private Integer categoryNumber;
    
    @Column(name = "title_nl", nullable = false)
    private String titleNl;
    
    @Column(name = "title_en", nullable = false)
    private String titleEn;
    
    @Column(name = "subtitle_nl")
    private String subtitleNl;
    
    @Column(name = "subtitle_en")
    private String subtitleEn;
    
    @Column(name = "description_nl", columnDefinition = "TEXT")
    private String descriptionNl;
    
    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Public constructor for mappers
    public CategoryJpaEntity() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Integer getCategoryNumber() { return categoryNumber; }
    public void setCategoryNumber(Integer categoryNumber) { this.categoryNumber = categoryNumber; }
    
    public String getTitleNl() { return titleNl; }
    public void setTitleNl(String titleNl) { this.titleNl = titleNl; }
    
    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    
    public String getDescriptionNl() { return descriptionNl; }
    public void setDescriptionNl(String descriptionNl) { this.descriptionNl = descriptionNl; }
    
    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }
    
    public String getSubtitleNl() { return subtitleNl; }
    public void setSubtitleNl(String subtitleNl) { this.subtitleNl = subtitleNl; }
    
    public String getSubtitleEn() { return subtitleEn; }
    public void setSubtitleEn(String subtitleEn) { this.subtitleEn = subtitleEn; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}


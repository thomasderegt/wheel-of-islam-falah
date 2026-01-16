package com.woi.content.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for ParagraphVersion (database mapping)
 */
@Entity
@Table(name = "paragraph_versions", schema = "content")
public class ParagraphVersionJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "paragraph_id", nullable = false)
    private Long paragraphId;
    
    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;
    
    @Column(name = "title_en", columnDefinition = "TEXT")
    private String titleEn;
    
    @Column(name = "title_nl", columnDefinition = "TEXT")
    private String titleNl;
    
    @Column(name = "content_en", columnDefinition = "TEXT")
    private String contentEn;
    
    @Column(name = "content_nl", columnDefinition = "TEXT")
    private String contentNl;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Public constructor for mappers
    public ParagraphVersionJpaEntity() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getParagraphId() { return paragraphId; }
    public void setParagraphId(Long paragraphId) { this.paragraphId = paragraphId; }
    
    public Integer getVersionNumber() { return versionNumber; }
    public void setVersionNumber(Integer versionNumber) { this.versionNumber = versionNumber; }
    
    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    
    public String getTitleNl() { return titleNl; }
    public void setTitleNl(String titleNl) { this.titleNl = titleNl; }
    
    public String getContentEn() { return contentEn; }
    public void setContentEn(String contentEn) { this.contentEn = contentEn; }
    
    public String getContentNl() { return contentNl; }
    public void setContentNl(String contentNl) { this.contentNl = contentNl; }
    
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


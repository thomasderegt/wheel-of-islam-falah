package com.woi.content.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for SectionVersion (database mapping)
 */
@Entity
@Table(name = "section_versions", schema = "content")
public class SectionVersionJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "section_id", nullable = false)
    private Long sectionId;
    
    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;
    
    @Column(name = "title_en", columnDefinition = "TEXT")
    private String titleEn;
    
    @Column(name = "title_nl", columnDefinition = "TEXT")
    private String titleNl;
    
    @Column(name = "intro_en", columnDefinition = "TEXT")
    private String introEn;
    
    @Column(name = "intro_nl", columnDefinition = "TEXT")
    private String introNl;
    
    @Column(name = "created_by")
    private Long createdBy;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    // Public constructor for mappers
    public SectionVersionJpaEntity() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getSectionId() { return sectionId; }
    public void setSectionId(Long sectionId) { this.sectionId = sectionId; }
    
    public Integer getVersionNumber() { return versionNumber; }
    public void setVersionNumber(Integer versionNumber) { this.versionNumber = versionNumber; }
    
    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }
    
    public String getTitleNl() { return titleNl; }
    public void setTitleNl(String titleNl) { this.titleNl = titleNl; }
    
    public String getIntroEn() { return introEn; }
    public void setIntroEn(String introEn) { this.introEn = introEn; }
    
    public String getIntroNl() { return introNl; }
    public void setIntroNl(String introNl) { this.introNl = introNl; }
    
    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


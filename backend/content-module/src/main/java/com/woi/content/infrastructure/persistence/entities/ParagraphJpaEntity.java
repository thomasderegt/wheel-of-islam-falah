package com.woi.content.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA entity for Paragraph (database mapping)
 */
@Entity
@Table(name = "paragraphs", schema = "content")
public class ParagraphJpaEntity {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @Column(name = "section_id", nullable = false)
    private Long sectionId;
    
    @Column(name = "paragraph_number", nullable = false)
    private Integer paragraphNumber;
    
    @Column(name = "working_status_paragraphversion_id")
    private Long workingStatusParagraphVersionId;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    // Public constructor for mappers
    public ParagraphJpaEntity() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getSectionId() { return sectionId; }
    public void setSectionId(Long sectionId) { this.sectionId = sectionId; }
    
    public Integer getParagraphNumber() { return paragraphNumber; }
    public void setParagraphNumber(Integer paragraphNumber) { this.paragraphNumber = paragraphNumber; }
    
    public Long getWorkingStatusParagraphVersionId() { return workingStatusParagraphVersionId; }
    public void setWorkingStatusParagraphVersionId(Long workingStatusParagraphVersionId) {
        this.workingStatusParagraphVersionId = workingStatusParagraphVersionId;
    }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}


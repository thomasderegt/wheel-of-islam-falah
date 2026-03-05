package com.woi.content.infrastructure.web.dtos;

import java.time.LocalDateTime;

/**
 * DTO for Review response
 */
public class ReviewDTO {
    private Long id;
    private Long reviewableItemId;
    private Long reviewedVersionId;
    private String status;  // SUBMITTED, APPROVED, REJECTED
    private String comment;
    private Long submittedBy;
    private Long reviewedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String entityType;  // SECTION, CHAPTER, BOOK, PARAGRAPH
    private String title;
    private Long referenceId;  // ID of the content entity (chapter, section, etc.)
    private String versionContentTitleEn;
    private String versionContentTitleNl;
    private String versionContentIntroEn;
    private String versionContentIntroNl;
    private String versionContentContentEn;
    private String versionContentContentNl;
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getReviewableItemId() { return reviewableItemId; }
    public void setReviewableItemId(Long reviewableItemId) { this.reviewableItemId = reviewableItemId; }
    
    public Long getReviewedVersionId() { return reviewedVersionId; }
    public void setReviewedVersionId(Long reviewedVersionId) { this.reviewedVersionId = reviewedVersionId; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    
    public Long getSubmittedBy() { return submittedBy; }
    public void setSubmittedBy(Long submittedBy) { this.submittedBy = submittedBy; }
    
    public Long getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(Long reviewedBy) { this.reviewedBy = reviewedBy; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getReferenceId() { return referenceId; }
    public void setReferenceId(Long referenceId) { this.referenceId = referenceId; }

    public String getVersionContentTitleEn() { return versionContentTitleEn; }
    public void setVersionContentTitleEn(String v) { this.versionContentTitleEn = v; }
    public String getVersionContentTitleNl() { return versionContentTitleNl; }
    public void setVersionContentTitleNl(String v) { this.versionContentTitleNl = v; }
    public String getVersionContentIntroEn() { return versionContentIntroEn; }
    public void setVersionContentIntroEn(String v) { this.versionContentIntroEn = v; }
    public String getVersionContentIntroNl() { return versionContentIntroNl; }
    public void setVersionContentIntroNl(String v) { this.versionContentIntroNl = v; }
    public String getVersionContentContentEn() { return versionContentContentEn; }
    public void setVersionContentContentEn(String v) { this.versionContentContentEn = v; }
    public String getVersionContentContentNl() { return versionContentContentNl; }
    public void setVersionContentContentNl(String v) { this.versionContentContentNl = v; }

    public static ReviewDTO from(com.woi.content.application.results.ReviewResult result) {
        ReviewDTO dto = new ReviewDTO();
        dto.setId(result.id());
        dto.setReviewableItemId(result.reviewableItemId());
        dto.setReviewedVersionId(result.reviewedVersionId());
        dto.setStatus(result.status().name());
        dto.setComment(result.comment());
        dto.setSubmittedBy(result.submittedBy());
        dto.setReviewedBy(result.reviewedBy());
        dto.setCreatedAt(result.createdAt());
        dto.setUpdatedAt(result.updatedAt());
        dto.setEntityType(result.entityType());
        dto.setTitle(result.title());
        dto.setReferenceId(result.referenceId());
        var vc = result.versionContent();
        if (vc != null) {
            dto.setVersionContentTitleEn(vc.titleEn());
            dto.setVersionContentTitleNl(vc.titleNl());
            dto.setVersionContentIntroEn(vc.introEn());
            dto.setVersionContentIntroNl(vc.introNl());
            dto.setVersionContentContentEn(vc.contentEn());
            dto.setVersionContentContentNl(vc.contentNl());
        }
        return dto;
    }
}


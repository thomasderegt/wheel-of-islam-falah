package com.woi.goalsokr.infrastructure.persistence.entities;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA entity for Initiative - database mapping
 * Supports both template initiatives (created_by_user_id null) and custom initiatives (created_by_user_id set)
 */
@Entity
@Table(name = "initiatives", schema = "goals_okr")
public class InitiativeJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "key_result_id", nullable = false)
    private Long keyResultId; // FK to goals_okr.key_results

    @Column(name = "title_nl", nullable = false)
    private String titleNl;

    @Column(name = "title_en", nullable = false)
    private String titleEn;

    @Column(name = "description_nl", columnDefinition = "TEXT")
    private String descriptionNl;

    @Column(name = "description_en", columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(name = "learning_flow_template_id")
    private Long learningFlowTemplateId; // Optional - Soft reference to learning.learning_flow_templates

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder;

    @Column(name = "number", length = 50)
    private String number;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "created_by_user_id")
    private Long createdByUserId; // NULL = template, user_id = custom initiative

    @Column(name = "target_date")
    private LocalDate targetDate;

    @Column(name = "status", length = 50)
    private String status;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "learning_flow_enrollment_id")
    private Long learningFlowEnrollmentId;

    // Public constructor for JPA
    public InitiativeJpaEntity() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getKeyResultId() { return keyResultId; }
    public void setKeyResultId(Long keyResultId) { this.keyResultId = keyResultId; }

    public String getTitleNl() { return titleNl; }
    public void setTitleNl(String titleNl) { this.titleNl = titleNl; }

    public String getTitleEn() { return titleEn; }
    public void setTitleEn(String titleEn) { this.titleEn = titleEn; }

    public String getDescriptionNl() { return descriptionNl; }
    public void setDescriptionNl(String descriptionNl) { this.descriptionNl = descriptionNl; }

    public String getDescriptionEn() { return descriptionEn; }
    public void setDescriptionEn(String descriptionEn) { this.descriptionEn = descriptionEn; }

    public Long getLearningFlowTemplateId() { return learningFlowTemplateId; }
    public void setLearningFlowTemplateId(Long learningFlowTemplateId) { this.learningFlowTemplateId = learningFlowTemplateId; }

    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Long getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(Long createdByUserId) { this.createdByUserId = createdByUserId; }

    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }

    public Long getLearningFlowEnrollmentId() { return learningFlowEnrollmentId; }
    public void setLearningFlowEnrollmentId(Long learningFlowEnrollmentId) { this.learningFlowEnrollmentId = learningFlowEnrollmentId; }
}

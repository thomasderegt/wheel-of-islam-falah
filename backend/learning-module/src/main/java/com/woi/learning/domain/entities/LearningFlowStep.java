package com.woi.learning.domain.entities;

/**
 * LearningFlowStep domain entity - Pure POJO (no JPA annotations)
 * 
 * Represents a step within a learning flow template.
 * Each step belongs to one paragraph and contains a reflection question.
 * 
 * Business rules:
 * - templateId is required
 * - paragraphId is required (soft reference to content.paragraphs)
 * - orderIndex is required and must be non-negative
 * - questionText is required
 * - orderIndex must be unique per template
 */
public class LearningFlowStep {
    private Long id;
    private Long templateId; // Required - FK to LearningFlowTemplate
    private Long paragraphId; // Required - soft reference to content.paragraphs
    private Integer orderIndex; // Required - must be unique per template
    private String questionText; // Required - reflection question text
    
    // Public constructor for mappers (infrastructure layer)
    public LearningFlowStep() {}
    
    /**
     * Factory method: Create a new learning flow step
     * 
     * @param templateId Template ID (required)
     * @param paragraphId Paragraph ID (required)
     * @param orderIndex Order index within template (required, must be >= 0)
     * @param questionText Reflection question text (required)
     * @return New LearningFlowStep instance
     * @throws IllegalArgumentException if required fields are null or invalid
     */
    public static LearningFlowStep create(Long templateId, Long paragraphId, Integer orderIndex, String questionText) {
        if (templateId == null) {
            throw new IllegalArgumentException("TemplateId cannot be null");
        }
        if (paragraphId == null) {
            throw new IllegalArgumentException("ParagraphId cannot be null");
        }
        if (orderIndex == null || orderIndex < 0) {
            throw new IllegalArgumentException("OrderIndex must be non-negative");
        }
        if (questionText == null || questionText.trim().isEmpty()) {
            throw new IllegalArgumentException("QuestionText cannot be null or empty");
        }
        
        LearningFlowStep step = new LearningFlowStep();
        step.templateId = templateId;
        step.paragraphId = paragraphId;
        step.orderIndex = orderIndex;
        step.questionText = questionText;
        return step;
    }
    
    // Getters
    public Long getId() { return id; }
    public Long getTemplateId() { return templateId; }
    public Long getParagraphId() { return paragraphId; }
    public Integer getOrderIndex() { return orderIndex; }
    public String getQuestionText() { return questionText; }
    
    // Setters for entity mapping (infrastructure layer only)
    public void setId(Long id) { this.id = id; }
    public void setTemplateId(Long templateId) { this.templateId = templateId; }
    public void setParagraphId(Long paragraphId) { this.paragraphId = paragraphId; }
    public void setOrderIndex(Integer orderIndex) { this.orderIndex = orderIndex; }
    public void setQuestionText(String questionText) { this.questionText = questionText; }
}


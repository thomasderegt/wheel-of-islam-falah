package com.woi.learning.api;

import java.util.List;
import java.util.Optional;

/**
 * Public interface for Learning module
 * This is the contract that other modules can use to interact with learning flows
 * 
 * v1 Scope:
 * - Template and step management
 * - Enrollment management
 * - Answer management
 * - Progress tracking
 * - Validation for Content module (isParagraphInUse)
 */
public interface LearningModuleInterface {
    
    // ========== Templates (Admin) ==========
    
    /**
     * Create a new learning flow template
     * @param name Template name
     * @param description Template description (optional)
     * @param sectionId Section ID (required)
     * @param createdBy User ID who created this template
     * @return The created template summary
     */
    LearningFlowTemplateSummary createTemplate(String name, String description, Long sectionId, Long createdBy);
    
    /**
     * Get all templates
     * @return List of all templates
     */
    List<LearningFlowTemplateSummary> getAllTemplates();
    
    /**
     * Get a template by ID
     * @param templateId Template ID
     * @return Optional containing the template if found
     */
    Optional<LearningFlowTemplateSummary> getTemplate(Long templateId);
    
    /**
     * Get all templates for a specific section
     * @param sectionId Section ID
     * @return List of templates for that section (can be multiple)
     */
    List<LearningFlowTemplateSummary> getTemplatesForSection(Long sectionId);
    
    /**
     * Delete a template (only if no enrollments exist)
     * @param templateId Template ID
     * @throws IllegalStateException if template has enrollments
     */
    void deleteTemplate(Long templateId);
    
    // ========== Steps (Admin) ==========
    
    /**
     * Create a new step for a template
     * @param templateId Template ID
     * @param paragraphId Paragraph ID
     * @param orderIndex Order index within template
     * @param questionText Reflection question text
     * @return The created step summary
     */
    LearningFlowStepSummary createStep(Long templateId, Long paragraphId, Integer orderIndex, String questionText);
    
    /**
     * Get all steps for a template (ordered by orderIndex)
     * @param templateId Template ID
     * @return List of steps ordered by orderIndex
     */
    List<LearningFlowStepSummary> getStepsForTemplate(Long templateId);
    
    /**
     * Delete a step
     * @param stepId Step ID
     */
    void deleteStep(Long stepId);
    
    // ========== Enrollments (User) ==========
    
    /**
     * Start a new enrollment for a user
     * @param userId User ID
     * @param templateId Template ID
     * @param sectionId Section ID (must match template.sectionId)
     * @return The created enrollment summary
     * @throws IllegalArgumentException if sectionId does not match template.sectionId
     */
    LearningFlowEnrollmentSummary startEnrollment(Long userId, Long templateId, Long sectionId);
    
    /**
     * Get an enrollment by ID
     * @param enrollmentId Enrollment ID
     * @return Optional containing the enrollment if found
     */
    Optional<LearningFlowEnrollmentSummary> getEnrollment(Long enrollmentId);
    
    /**
     * Get all enrollments for a user
     * @param userId User ID
     * @return List of enrollments for that user
     */
    List<LearningFlowEnrollmentSummary> getEnrollmentsForUser(Long userId);
    
    /**
     * Mark an enrollment as completed
     * @param enrollmentId Enrollment ID
     */
    void completeEnrollment(Long enrollmentId);
    
    // ========== Answers ==========
    
    /**
     * Add an answer to an enrollment step
     * Automatically sets progress to IN_PROGRESS if it was NOT_STARTED
     * @param enrollmentId Enrollment ID
     * @param stepId Step ID
     * @param type Answer type (PICTURE_QUESTION or REFLECTION)
     * @param answerText Answer text
     * @return The created answer summary
     */
    EnrollmentAnswerSummary addAnswer(Long enrollmentId, Long stepId, AnswerType type, String answerText);
    
    /**
     * Get all answers for an enrollment step
     * @param enrollmentId Enrollment ID
     * @param stepId Step ID
     * @return List of answers for that step
     */
    List<EnrollmentAnswerSummary> getAnswers(Long enrollmentId, Long stepId);
    
    /**
     * Get all answers for an enrollment step filtered by type
     * @param enrollmentId Enrollment ID
     * @param stepId Step ID
     * @param type Answer type filter
     * @return List of answers matching the type
     */
    List<EnrollmentAnswerSummary> getAnswersByType(Long enrollmentId, Long stepId, AnswerType type);
    
    // ========== Progress ==========
    
    /**
     * Update progress for an enrollment step
     * @param enrollmentId Enrollment ID
     * @param stepId Step ID
     * @param status New status
     * @return The updated progress summary
     */
    EnrollmentStepProgressSummary updateProgress(Long enrollmentId, Long stepId, ProgressStatus status);
    
    /**
     * Get progress for all steps in an enrollment
     * @param enrollmentId Enrollment ID
     * @return List of progress summaries for all steps
     */
    List<EnrollmentStepProgressSummary> getProgressForEnrollment(Long enrollmentId);
    
    /**
     * Get progress for a specific step
     * @param enrollmentId Enrollment ID
     * @param stepId Step ID
     * @return Optional containing the progress if found
     */
    Optional<EnrollmentStepProgressSummary> getProgressForStep(Long enrollmentId, Long stepId);
    
    // ========== Validation (for Content module) ==========
    
    /**
     * Check if a paragraph is in use by any learning flow step
     * Used by Content module to validate deletion
     * @param paragraphId Paragraph ID
     * @return true if paragraph is in use, false otherwise
     */
    boolean isParagraphInUse(Long paragraphId);
}


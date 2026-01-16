package com.woi.learning.application.commands;

/**
 * Command for starting a new learning flow enrollment
 */
public record StartEnrollmentCommand(
    Long userId,
    Long templateId,
    Long sectionId
) {
    public StartEnrollmentCommand {
        if (userId == null) {
            throw new IllegalArgumentException("UserId cannot be null");
        }
        if (templateId == null) {
            throw new IllegalArgumentException("TemplateId cannot be null");
        }
        if (sectionId == null) {
            throw new IllegalArgumentException("SectionId cannot be null");
        }
    }
}


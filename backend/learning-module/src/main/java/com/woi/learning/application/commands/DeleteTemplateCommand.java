package com.woi.learning.application.commands;

/**
 * Command for deleting a learning flow template
 */
public record DeleteTemplateCommand(
    Long templateId
) {
    public DeleteTemplateCommand {
        if (templateId == null) {
            throw new IllegalArgumentException("TemplateId cannot be null");
        }
    }
}


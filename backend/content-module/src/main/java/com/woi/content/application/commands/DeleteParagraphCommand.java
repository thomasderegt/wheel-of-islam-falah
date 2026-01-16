package com.woi.content.application.commands;

/**
 * Command for deleting a paragraph
 * 
 * Note: Before deleting, check if paragraph is used in Learning module.
 * This validation should be done in the handler.
 */
public record DeleteParagraphCommand(
    Long paragraphId
) {
    public DeleteParagraphCommand {
        if (paragraphId == null) {
            throw new IllegalArgumentException("Paragraph ID cannot be null");
        }
    }
}


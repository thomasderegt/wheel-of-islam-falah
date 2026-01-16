package com.woi.content.application.commands;

/**
 * Command for updating paragraph metadata (paragraphNumber)
 */
public record UpdateParagraphCommand(
    Long paragraphId,
    Integer paragraphNumber
) {
    public UpdateParagraphCommand {
        if (paragraphId == null) {
            throw new IllegalArgumentException("Paragraph ID cannot be null");
        }
        if (paragraphNumber == null || paragraphNumber < 1) {
            throw new IllegalArgumentException("ParagraphNumber must be a positive integer");
        }
    }
}


package com.woi.content.application.results;

/**
 * Content of the version being reviewed (title, intro, content)
 */
public record ReviewVersionContent(
    String titleEn,
    String titleNl,
    String introEn,
    String introNl,
    String contentEn,
    String contentNl
) {
    public static ReviewVersionContent empty() {
        return new ReviewVersionContent("", "", "", "", "", "");
    }
}

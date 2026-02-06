package com.woi.goalsokr.application.results;

/**
 * Result DTO for LifeDomain
 */
public record LifeDomainResult(
    Long id,
    String domainKey,
    String titleNl,
    String titleEn,
    String descriptionNl,
    String descriptionEn,
    String iconName,
    Integer displayOrder
) {
    public static LifeDomainResult from(com.woi.goalsokr.domain.entities.LifeDomain lifeDomain) {
        return new LifeDomainResult(
            lifeDomain.getId(),
            lifeDomain.getDomainKey().name(),
            lifeDomain.getTitleNl(),
            lifeDomain.getTitleEn(),
            lifeDomain.getDescriptionNl(),
            lifeDomain.getDescriptionEn(),
            lifeDomain.getIconName(),
            lifeDomain.getDisplayOrder()
        );
    }
}

package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.UpdateLifeDomainCommand;
import com.woi.goalsokr.application.results.LifeDomainResult;
import com.woi.goalsokr.domain.entities.LifeDomain;
import com.woi.goalsokr.domain.repositories.LifeDomainRepository;
import com.woi.goalsokr.domain.repositories.WheelRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Command handler for updating a life domain
 */
@Component
public class UpdateLifeDomainCommandHandler {

    private final LifeDomainRepository lifeDomainRepository;
    private final WheelRepository wheelRepository;

    public UpdateLifeDomainCommandHandler(LifeDomainRepository lifeDomainRepository, WheelRepository wheelRepository) {
        this.lifeDomainRepository = lifeDomainRepository;
        this.wheelRepository = wheelRepository;
    }

    @Transactional
    public LifeDomainResult handle(UpdateLifeDomainCommand command) {
        LifeDomain lifeDomain = lifeDomainRepository.findById(command.id())
            .orElseThrow(() -> new IllegalArgumentException("Life domain not found with id: " + command.id()));

        if (wheelRepository.findById(command.wheelId()).isEmpty()) {
            throw new IllegalArgumentException("Wheel not found with id: " + command.wheelId());
        }

        String titleNl = ensureTitle(command.titleNl(), command.titleEn());
        String titleEn = ensureTitle(command.titleEn(), command.titleNl());

        lifeDomain.setWheelId(command.wheelId());
        lifeDomain.setTitleNl(titleNl);
        lifeDomain.setTitleEn(titleEn);
        lifeDomain.setDescriptionNl(command.descriptionNl() != null ? command.descriptionNl().trim() : null);
        lifeDomain.setDescriptionEn(command.descriptionEn() != null ? command.descriptionEn().trim() : null);
        lifeDomain.setIconName(command.iconName() != null ? command.iconName().trim() : null);
        lifeDomain.setDisplayOrder(command.displayOrder() != null ? command.displayOrder() : 0);

        LifeDomain saved = lifeDomainRepository.save(lifeDomain);
        return LifeDomainResult.from(saved);
    }

    private static String ensureTitle(String primary, String fallback) {
        if (primary != null && !primary.trim().isEmpty()) {
            return primary.trim();
        }
        return fallback != null && !fallback.trim().isEmpty() ? fallback.trim() : "";
    }
}

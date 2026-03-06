package com.woi.goalsokr.application.handlers.commands;

import com.woi.goalsokr.application.commands.CreateLifeDomainCommand;
import com.woi.goalsokr.application.results.LifeDomainResult;
import com.woi.goalsokr.domain.entities.LifeDomain;
import com.woi.goalsokr.domain.repositories.LifeDomainRepository;
import com.woi.goalsokr.domain.repositories.WheelRepository;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Command handler for creating a life domain
 */
@Component
public class CreateLifeDomainCommandHandler {

    private final LifeDomainRepository lifeDomainRepository;
    private final WheelRepository wheelRepository;

    public CreateLifeDomainCommandHandler(LifeDomainRepository lifeDomainRepository, WheelRepository wheelRepository) {
        this.lifeDomainRepository = lifeDomainRepository;
        this.wheelRepository = wheelRepository;
    }

    @Transactional
    public LifeDomainResult handle(CreateLifeDomainCommand command) {
        if (wheelRepository.findById(command.wheelId()).isEmpty()) {
            throw new IllegalArgumentException("Wheel not found with id: " + command.wheelId());
        }

        String titleNl = ensureTitle(command.titleNl(), command.titleEn());
        String titleEn = ensureTitle(command.titleEn(), command.titleNl());

        LifeDomain lifeDomain = new LifeDomain();
        lifeDomain.setWheelId(command.wheelId());
        lifeDomain.setTitleNl(titleNl);
        lifeDomain.setTitleEn(titleEn);
        lifeDomain.setDescriptionNl(command.descriptionNl() != null ? command.descriptionNl().trim() : null);
        lifeDomain.setDescriptionEn(command.descriptionEn() != null ? command.descriptionEn().trim() : null);
        lifeDomain.setIconName(command.iconName() != null ? command.iconName().trim() : null);
        lifeDomain.setDisplayOrder(command.displayOrder() != null ? command.displayOrder() : 0);
        lifeDomain.setCreatedAt(LocalDateTime.now());

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

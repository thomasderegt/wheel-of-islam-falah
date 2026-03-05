package com.woi.content.application.handlers.queries;

import com.woi.content.application.queries.GetReviewsByStatusQuery;
import com.woi.content.application.results.ReviewResult;
import com.woi.content.application.results.ReviewVersionContent;
import com.woi.content.domain.entities.BookVersion;
import com.woi.content.domain.entities.ChapterVersion;
import com.woi.content.domain.entities.ParagraphVersion;
import com.woi.content.domain.entities.Review;
import com.woi.content.domain.entities.ReviewableItem;
import com.woi.content.domain.entities.SectionVersion;
import com.woi.content.domain.enums.ReviewableType;
import com.woi.content.domain.repositories.BookVersionRepository;
import com.woi.content.domain.repositories.ChapterVersionRepository;
import com.woi.content.domain.repositories.ParagraphVersionRepository;
import com.woi.content.domain.repositories.ReviewRepository;
import com.woi.content.domain.repositories.ReviewableItemRepository;
import com.woi.content.domain.repositories.SectionVersionRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

/**
 * Query handler for getting reviews by status with entity type and title
 */
@Component
public class GetReviewsByStatusQueryHandler {
    private final ReviewRepository reviewRepository;
    private final ReviewableItemRepository reviewableItemRepository;
    private final SectionVersionRepository sectionVersionRepository;
    private final ChapterVersionRepository chapterVersionRepository;
    private final BookVersionRepository bookVersionRepository;
    private final ParagraphVersionRepository paragraphVersionRepository;

    public GetReviewsByStatusQueryHandler(
            ReviewRepository reviewRepository,
            ReviewableItemRepository reviewableItemRepository,
            SectionVersionRepository sectionVersionRepository,
            ChapterVersionRepository chapterVersionRepository,
            BookVersionRepository bookVersionRepository,
            ParagraphVersionRepository paragraphVersionRepository) {
        this.reviewRepository = reviewRepository;
        this.reviewableItemRepository = reviewableItemRepository;
        this.sectionVersionRepository = sectionVersionRepository;
        this.chapterVersionRepository = chapterVersionRepository;
        this.bookVersionRepository = bookVersionRepository;
        this.paragraphVersionRepository = paragraphVersionRepository;
    }

    public List<ReviewResult> handle(GetReviewsByStatusQuery query) {
        return reviewRepository.findByStatus(query.status()).stream()
            .map(this::toResultWithTypeAndTitle)
            .toList();
    }

    /**
     * Enrich a single review with entityType, title, referenceId. Used by GetReviewQueryHandler.
     */
    public ReviewResult enrichReview(Review review) {
        return toResultWithTypeAndTitle(review);
    }

    private ReviewResult toResultWithTypeAndTitle(Review review) {
        String entityType = "";
        String title = "";
        Long referenceId = null;
        ReviewVersionContent versionContent = ReviewVersionContent.empty();
        Optional<ReviewableItem> itemOpt = reviewableItemRepository.findById(review.getReviewableItemId());
        if (itemOpt.isPresent()) {
            ReviewableItem item = itemOpt.get();
            ReviewableType type = item.getType();
            entityType = type.name();
            referenceId = item.getReferenceId();
            Long versionId = review.getReviewedVersionId();
            // Try type-specific repository first
            title = resolveVersionTitle(type, versionId);
            // Fallback: if not found by type, try all version tables (handles data inconsistencies)
            if (title.isEmpty()) {
                title = findTitleInAnyVersionTable(versionId);
            }
            versionContent = resolveVersionContent(type, versionId);
        }
        return ReviewResult.from(review, entityType, title, referenceId, versionContent);
    }

    private ReviewVersionContent resolveVersionContent(ReviewableType type, Long versionId) {
        return switch (type) {
            case SECTION -> sectionVersionRepository.findById(versionId)
                .map(this::toVersionContent).orElse(ReviewVersionContent.empty());
            case CHAPTER -> chapterVersionRepository.findById(versionId)
                .map(this::toVersionContent).orElse(ReviewVersionContent.empty());
            case BOOK -> bookVersionRepository.findById(versionId)
                .map(this::toVersionContent).orElse(ReviewVersionContent.empty());
            case PARAGRAPH -> paragraphVersionRepository.findById(versionId)
                .map(this::toVersionContent).orElse(ReviewVersionContent.empty());
        };
    }

    private ReviewVersionContent toVersionContent(SectionVersion v) {
        return new ReviewVersionContent(
            nullToEmpty(v.getTitleEn()), nullToEmpty(v.getTitleNl()),
            nullToEmpty(v.getIntroEn()), nullToEmpty(v.getIntroNl()),
            "", ""
        );
    }

    private ReviewVersionContent toVersionContent(ChapterVersion v) {
        return new ReviewVersionContent(
            nullToEmpty(v.getTitleEn()), nullToEmpty(v.getTitleNl()),
            nullToEmpty(v.getIntroEn()), nullToEmpty(v.getIntroNl()),
            "", ""
        );
    }

    private ReviewVersionContent toVersionContent(BookVersion v) {
        return new ReviewVersionContent(
            nullToEmpty(v.getTitleEn()), nullToEmpty(v.getTitleNl()),
            nullToEmpty(v.getIntroEn()), nullToEmpty(v.getIntroNl()),
            "", ""
        );
    }

    private ReviewVersionContent toVersionContent(ParagraphVersion v) {
        return new ReviewVersionContent(
            nullToEmpty(v.getTitleEn()), nullToEmpty(v.getTitleNl()),
            "", "",
            nullToEmpty(v.getContentEn()), nullToEmpty(v.getContentNl())
        );
    }

    private String nullToEmpty(String s) {
        return s != null ? s : "";
    }

    private String resolveVersionTitle(ReviewableType type, Long versionId) {
        return switch (type) {
            case SECTION -> sectionVersionRepository.findById(versionId).map(this::getSectionVersionDisplayTitle).orElse("");
            case CHAPTER -> chapterVersionRepository.findById(versionId).map(this::getChapterVersionDisplayTitle).orElse("");
            case BOOK -> bookVersionRepository.findById(versionId).map(this::getBookVersionDisplayTitle).orElse("");
            case PARAGRAPH -> paragraphVersionRepository.findById(versionId).map(this::getParagraphVersionDisplayTitle).orElse("");
        };
    }

    private String findTitleInAnyVersionTable(Long versionId) {
        Optional<SectionVersion> sv = sectionVersionRepository.findById(versionId);
        if (sv.isPresent()) return getSectionVersionDisplayTitle(sv.get());
        Optional<ChapterVersion> cv = chapterVersionRepository.findById(versionId);
        if (cv.isPresent()) return getChapterVersionDisplayTitle(cv.get());
        Optional<BookVersion> bv = bookVersionRepository.findById(versionId);
        if (bv.isPresent()) return getBookVersionDisplayTitle(bv.get());
        Optional<ParagraphVersion> pv = paragraphVersionRepository.findById(versionId);
        if (pv.isPresent()) return getParagraphVersionDisplayTitle(pv.get());
        return "";
    }

    private String firstNonEmpty(String... values) {
        for (String v : values) {
            if (v != null && !v.trim().isEmpty()) {
                return v.trim();
            }
        }
        return "";
    }

    private String getSectionVersionDisplayTitle(SectionVersion v) {
        return firstNonEmpty(v.getTitleEn(), v.getTitleNl(), v.getIntroEn(), v.getIntroNl());
    }

    private String getChapterVersionDisplayTitle(ChapterVersion v) {
        return firstNonEmpty(v.getTitleEn(), v.getTitleNl(), v.getIntroEn(), v.getIntroNl());
    }

    private String getBookVersionDisplayTitle(BookVersion v) {
        return firstNonEmpty(v.getTitleEn(), v.getTitleNl(), v.getIntroEn(), v.getIntroNl());
    }

    private String getParagraphVersionDisplayTitle(ParagraphVersion v) {
        return firstNonEmpty(v.getTitleEn(), v.getTitleNl(), v.getContentEn(), v.getContentNl());
    }
}


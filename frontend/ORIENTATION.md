# Orientation Page Content

This document describes the content structure of the Orientation page (`/orientation`).

## Overview

The Orientation page provides information about the platform's theological, spiritual, and legal foundations in Sunni Islam.

## Page Structure

### Header
- Title: Uses translation key `orientation.title`
- Full Text: Uses translation key `orientation.fullText`

### Main Content Sections

#### 1. Opening Statement
- **Title**: `orientation.opening.title`
- **Statement**: `orientation.opening.statement` (displayed in italics)
- **Explanation**: `orientation.opening.explanation`

#### 2. Theology (ʿAqīdah)
- **Title**: `orientation.beliefs.title`
- **Content**: `orientation.beliefs.content` (displayed in italics)
- **Explanation**: `orientation.beliefs.explanation`
- **Examples Title**: `orientation.beliefs.examples.title`
- **Examples**: `orientation.beliefs.examples`

#### 3. Spirituality (Tazkiyyah / Iḥsān)
- **Title**: `orientation.spiritual.title`
- **Content**: `orientation.spiritual.content` (displayed in italics)
- **Explanation**: `orientation.spiritual.explanation`
- **Terms Title**: `orientation.spiritual.terms.title`
- **Terms**: `orientation.spiritual.terms`
- **Examples Title**: `orientation.spiritual.examples.title`
- **Examples**: `orientation.spiritual.examples`
- **Conclusion**: `orientation.spiritual.conclusion` (displayed in italics)

#### 4. Islamic Law (Fiqh)
- **Title**: `orientation.legal.title`
- **Content**: `orientation.legal.content` (displayed in italics)
- **Explanation**: `orientation.legal.explanation`
- **Examples Title**: `orientation.legal.examples.title`
- **Examples**: `orientation.legal.examples`
- **Conclusion**: `orientation.legal.conclusion` (displayed in italics)

#### 5. The Sharīʿah (Timeless + Dynamic)
- **Title**: `orientation.shariah.title`
- **Content**: `orientation.shariah.content` (displayed in italics)
- **Explanation**: `orientation.shariah.explanation`
- **Examples Title**: `orientation.shariah.examples.title`
- **Examples**: `orientation.shariah.examples`

### Team Section
- **Title**: `orientation.team`
- **Dr. Hatem**: Image `/Dr Hatem.webp`, Title: `orientation.drHatem.title`
- **Bilal**: Image `/Bilal.jpeg`, Title: `orientation.bilal.title`

## Common Translation Keys
- **Explanation**: `orientation.explanation` (used as a label for explanation sections)

## Background Image
- Image: `/BackgroundImageOrientation.png`
- Styling: Full screen background with fixed attachment

## Notes
- All content is internationalized using translation keys
- The page supports both Dutch (NL) and English (EN) languages
- Content is displayed in cards with opacity styling
- Explanation sections use a custom `Explanation` component with `ExplanationTitle`, `ExplanationContent`, and `ExplanationSection` sub-components

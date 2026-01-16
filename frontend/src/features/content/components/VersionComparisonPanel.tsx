/**
 * VersionComparisonPanel Component
 * Side-by-side comparison of two versions
 */

'use client'

interface VersionComparisonPanelProps {
  version1: any
  version2: any
  type: 'BOOK' | 'CHAPTER' | 'PARAGRAPH' | 'SECTION'
  onClose: () => void
}

export function VersionComparisonPanel({
  version1,
  version2,
  type,
  onClose,
}: VersionComparisonPanelProps) {
  // TODO: Implement comparison panel
  return (
    <div>
      <p>VersionComparisonPanel - TODO</p>
    </div>
  )
}


/**
 * VersionHistoryPanel Component
 * Displays version history for content entities
 */

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import type { EntityType } from '../hooks/useVersionHistory'

export interface VersionHistoryItem {
  id: number
  versionNumber: number
  createdAt: string
  createdBy?: number | null
  titleEn?: string | null
  titleNl?: string | null
}

interface VersionHistoryPanelProps {
  versions: VersionHistoryItem[]
  currentVersionId?: number | null
  approvedVersionId?: number | null
  entityType: EntityType
  onCompare?: (versionId: number) => void
  onVersionClick?: (versionId: number) => void
}

export function VersionHistoryPanel({
  versions,
  currentVersionId,
  approvedVersionId,
  entityType,
  onCompare,
  onVersionClick,
}: VersionHistoryPanelProps) {
  if (versions.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Version History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {versions.map((version) => {
            const isCurrent = version.id === currentVersionId
            const isApproved = approvedVersionId && version.id === approvedVersionId

            return (
              <div
                key={version.id}
                onClick={() => onVersionClick?.(version.id)}
                className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                  isCurrent 
                    ? "bg-primary/10 border-primary" 
                    : "hover:bg-muted/50 hover:border-muted-foreground/50"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">v{version.versionNumber}</span>
                    {isCurrent && (
                      <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                        Current
                      </span>
                    )}
                    {isApproved && (
                      <span className="rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 text-xs font-medium">
                        Published
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {new Date(version.createdAt).toLocaleString()}
                    </span>
                    {(version.titleNl || version.titleEn) && (
                      <span className="text-sm text-muted-foreground">
                        - {version.titleNl || version.titleEn}
                      </span>
                    )}
                  </div>
                  {!isCurrent && onCompare && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onCompare(version.id)
                      }}
                    >
                      Compare
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}


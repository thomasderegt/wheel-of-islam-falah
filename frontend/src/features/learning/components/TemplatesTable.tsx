/**
 * TemplatesTable Component
 * Table displaying learning flow templates with actions
 */

'use client'

import { useRouter } from 'next/navigation'
import type { TemplateItemSummary } from '../hooks/useTemplates'
import type { LearningFlowStepDTO } from '@/shared/api/types'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/components/ui/table'

interface TemplatesTableProps {
  readonly items: TemplateItemSummary[]
  readonly onDelete: (templateId: number) => void
}

type TableRowItem =
  | { type: 'TEMPLATE'; data: TemplateItemSummary }
  | { type: 'STEP'; data: LearningFlowStepDTO; templateId: number; templateName: string }

export function TemplatesTable({ items, onDelete }: TemplatesTableProps) {
  const router = useRouter()

  // Flatten templates and steps into a single array
  const tableRows: TableRowItem[] = items.flatMap((template) => [
    { type: 'TEMPLATE' as const, data: template },
    ...template.steps.map((step) => ({
      type: 'STEP' as const,
      data: step,
      templateId: template.id,
      templateName: template.name,
    })),
  ])

  const handleTemplateClick = (templateId: number) => {
    router.push(`/admin/learning/templates/${templateId}`)
  }

  const handleStepClick = (templateId: number, stepId: number) => {
    router.push(`/admin/learning/templates/${templateId}/steps/${stepId}/edit`)
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No templates found</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableRows.map((row) => {
            if (row.type === 'TEMPLATE') {
              const template = row.data
              return (
                <TableRow
                  key={`template-${template.id}`}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleTemplateClick(template.id)}
                >
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium">
                      Template
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground line-clamp-2">
                      {template.description || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {template.bookTitle && (
                        <>
                          {template.bookTitle}
                          {template.chapterTitle && ` > ${template.chapterTitle}`}
                          {template.sectionTitle && ` > ${template.sectionTitle}`}
                        </>
                      )}
                      {!template.bookTitle && `Section ${template.sectionId}`}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">-</span>
                  </TableCell>
                  <TableCell>
                    {new Date(template.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              )
            } else {
              const step = row.data
              return (
                <TableRow
                  key={`step-${step.id}`}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleStepClick(row.templateId, step.id)}
                >
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-purple-100 text-purple-800 px-2 py-1 text-xs font-medium">
                      Step
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">{row.templateName}</span>
                      <span className="text-xs text-muted-foreground">→</span>
                      <span>{step.questionText}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">-</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">-</div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{step.orderIndex}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">-</span>
                  </TableCell>
                </TableRow>
              )
            }
          })}
        </TableBody>
      </Table>
    </div>
  )
}

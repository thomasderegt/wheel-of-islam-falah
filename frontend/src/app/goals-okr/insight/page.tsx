'use client'

/**
 * Kanban Dashboard Page (tijdelijk uitgeschakeld)
 * Shows statistics about kanban items
 */

import { ProtectedRoute } from '@/features/auth'

export default function KanbanDashboardPage() {
  // --- Hele pagina tijdelijk uitgecommentarieerd / uitgeschakeld ---
  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col p-8">
        <h1 className="text-xl font-semibold mb-2">Insight</h1>
        <p className="text-muted-foreground">Deze pagina is tijdelijk uitgeschakeld. Geen cards of grafieken.</p>
      </div>
    </ProtectedRoute>
  )
}

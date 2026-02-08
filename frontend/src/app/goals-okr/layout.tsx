'use client'

/**
 * Goals OKR Layout
 * 
 * Shared layout for all goals-okr pages
 * Includes floating cart button and cart sidebar
 */

import { useState } from 'react'
import { OKRCart } from '@/features/goals-okr/components/OKRCart'
import { OKRCartProvider, useOKRCart } from '@/features/goals-okr/contexts/OKRCartContext'
import { Button } from '@/shared/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'

function GoalsOKRLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const [cartOpen, setCartOpen] = useState(false)
  const { getItemCount } = useOKRCart()
  const itemCount = getItemCount()

  return (
    <div className="relative">
      {children}
      
      {/* Floating Cart Button - Fixed to viewport */}
      <div className="fixed top-4 right-4 z-50" style={{ position: 'fixed', top: '1rem', right: '1rem' }}>
        <Button
          variant="default"
          size="lg"
          onClick={() => setCartOpen(true)}
          className="rounded-full shadow-lg h-14 w-14 p-0 relative"
          title="Open cart"
        >
          <ShoppingCart className="h-6 w-6" />
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground min-w-[20px] h-5 flex items-center justify-center text-xs">
              {itemCount}
            </Badge>
          )}
        </Button>
      </div>
      
      {/* Cart Sidebar */}
      <OKRCart open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  )
}

export default function GoalsOKRLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <OKRCartProvider>
      <GoalsOKRLayoutContent>
        {children}
      </GoalsOKRLayoutContent>
    </OKRCartProvider>
  )
}

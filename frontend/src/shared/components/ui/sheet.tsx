'use client'

import * as React from 'react'
import { cn } from '@/shared/utils/cn'
import { X } from 'lucide-react'

interface SheetContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = React.createContext<SheetContextValue | undefined>(undefined)

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

function Sheet({ open, onOpenChange, children }: SheetProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => onOpenChange(false)}
          />
          {children}
        </div>
      )}
    </SheetContext.Provider>
  )
}

interface SheetContentProps {
  side?: 'left' | 'right' | 'top' | 'bottom'
  children: React.ReactNode
  className?: string
}

function SheetContent({ side = 'right', children, className }: SheetContentProps) {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error('SheetContent must be used within Sheet')
  }

  const sideClasses = {
    right: 'right-0 top-0 h-full w-full sm:w-[320px]',
    left: 'left-0 top-0 h-full w-full sm:w-[320px]',
    top: 'top-0 left-0 right-0 h-[400px]',
    bottom: 'bottom-0 left-0 right-0 h-[400px]',
  }

  return (
    <div
      className={cn(
        'fixed bg-background border shadow-lg',
        sideClasses[side],
        className
      )}
    >
      {children}
    </div>
  )
}

interface SheetHeaderProps {
  children: React.ReactNode
  className?: string
}

function SheetHeader({ children, className }: SheetHeaderProps) {
  const context = React.useContext(SheetContext)
  if (!context) {
    throw new Error('SheetHeader must be used within Sheet')
  }

  return (
    <div className={cn('flex items-center justify-between p-3 border-b', className)}>
      {children}
      <button
        onClick={() => context.onOpenChange(false)}
        className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  )
}

interface SheetTitleProps {
  children: React.ReactNode
  className?: string
}

function SheetTitle({ children, className }: SheetTitleProps) {
  return <h2 className={cn('text-base font-semibold', className)}>{children}</h2>
}

interface SheetDescriptionProps {
  children: React.ReactNode
  className?: string
}

function SheetDescription({ children, className }: SheetDescriptionProps) {
  return <p className={cn('text-xs text-muted-foreground', className)}>{children}</p>
}

interface SheetBodyProps {
  children: React.ReactNode
  className?: string
}

function SheetBody({ children, className }: SheetBodyProps) {
  return <div className={cn('p-3 overflow-y-auto h-[calc(100%-140px)]', className)}>{children}</div>
}

interface SheetFooterProps {
  children: React.ReactNode
  className?: string
}

function SheetFooter({ children, className }: SheetFooterProps) {
  return <div className={cn('p-3 border-t', className)}>{children}</div>
}

export { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetBody, SheetFooter }

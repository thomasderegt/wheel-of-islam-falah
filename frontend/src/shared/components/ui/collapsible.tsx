'use client'

import * as React from 'react'
import { cn } from '@/shared/utils/cn'

interface CollapsibleProps {
  readonly open?: boolean
  readonly defaultOpen?: boolean
  readonly onOpenChange?: (open: boolean) => void
  readonly children: React.ReactNode
}

const CollapsibleContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
} | null>(null)

function Collapsible({ open: controlledOpen, defaultOpen = false, onOpenChange, children }: CollapsibleProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  
  const handleOpenChange = React.useCallback((newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }, [isControlled, onOpenChange])

  const contextValue = React.useMemo(
    () => ({ open, onOpenChange: handleOpenChange }),
    [open, handleOpenChange]
  )

  return (
    <CollapsibleContext.Provider value={contextValue}>
      {children}
    </CollapsibleContext.Provider>
  )
}

interface CollapsibleTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  readonly asChild?: boolean
  readonly children: React.ReactNode
}

function CollapsibleTrigger({ asChild, children, className, ...props }: CollapsibleTriggerProps) {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error('CollapsibleTrigger must be used within Collapsible')
  }

  const { open, onOpenChange } = context

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      onClick: (e: React.MouseEvent) => {
        onOpenChange(!open)
        children.props.onClick?.(e)
      },
      className: cn(className, children.props.className),
    } as any)
  }

  return (
    <button
      type="button"
      onClick={() => onOpenChange(!open)}
      className={cn('cursor-pointer', className)}
      {...props}
    >
      {children}
    </button>
  )
}

interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly children: React.ReactNode
}

function CollapsibleContent({ children, className, ...props }: CollapsibleContentProps) {
  const context = React.useContext(CollapsibleContext)
  if (!context) {
    throw new Error('CollapsibleContent must be used within Collapsible')
  }

  const { open } = context

  if (!open) {
    return null
  }

  return (
    <div className={cn('overflow-hidden', className)} {...props}>
      {children}
    </div>
  )
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/utils/cn'

interface SelectContextValue {
  value: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  selectId: string
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

function Select({ value, onValueChange, children }: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const selectId = React.useId()
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (open) {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        // Check if click is outside both the container and the portal content
        const isOutsideContainer = containerRef.current && !containerRef.current.contains(target)
        const isOutsidePortal = !target.closest(`[data-select-content="${selectId}"]`)
        if (isOutsideContainer && isOutsidePortal) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open, selectId])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, selectId }}>
      <div ref={containerRef} className="relative" data-select={selectId}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  const context = React.useContext(SelectContext)
  
  if (!context) {
    throw new Error('SelectTrigger must be used within Select')
  }

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => context.setOpen(!context.open)}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("transition-transform", context.open && "rotate-180")}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  )
}

interface SelectValueProps {
  placeholder?: string
}

function SelectValue({ placeholder }: SelectValueProps) {
  const context = React.useContext(SelectContext)
  
  if (!context) {
    throw new Error('SelectValue must be used within Select')
  }

  return <span>{context.value || placeholder}</span>
}

interface SelectContentProps {
  children: React.ReactNode
}

function SelectContent({ children }: SelectContentProps) {
  const context = React.useContext(SelectContext)
  const [position, setPosition] = React.useState({ top: 0, left: 0, width: 0 })
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const [mounted, setMounted] = React.useState(false)
  
  if (!context) {
    throw new Error('SelectContent must be used within Select')
  }

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const updatePosition = React.useCallback(() => {
    if (!context.open || !mounted) return
    
    // Find the trigger element using the selectId
    const selectContainer = document.querySelector(`[data-select="${context.selectId}"]`)
    if (selectContainer) {
      const trigger = selectContainer.querySelector('button')
      if (trigger) {
        const rect = trigger.getBoundingClientRect()
        setPosition({
          top: rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: rect.width,
        })
      }
    }
  }, [context.open, context.selectId, mounted])

  React.useEffect(() => {
    if (context.open && mounted) {
      updatePosition()
      
      // Update position on scroll and resize
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [context.open, mounted, updatePosition])

  if (!context.open || !mounted) return null

  const content = (
    <div
      ref={contentRef}
      data-select-content={context.selectId}
      className="fixed z-[100] min-w-[8rem] overflow-hidden rounded-md border bg-white border-black shadow-lg"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
      }}
    >
      <div className="p-1">
        {children}
      </div>
    </div>
  )

  return createPortal(content, document.body)
}

interface SelectItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
}

function SelectItem({ value, children, className, ...props }: SelectItemProps) {
  const context = React.useContext(SelectContext)
  
  if (!context) {
    throw new Error('SelectItem must be used within Select')
  }

  const isSelected = context.value === value

  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent",
        isSelected && "bg-accent",
        className
      )}
      onClick={() => {
        context.onValueChange(value)
        context.setOpen(false)
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }


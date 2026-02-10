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
        // Check if click is on the trigger button itself - if so, don't close
        const isTrigger = containerRef.current?.querySelector('button')?.contains(target)
        if (isTrigger) {
          return
        }
        // Check if click is outside both the container and the portal content
        const isOutsideContainer = containerRef.current && !containerRef.current.contains(target)
        const isOutsidePortal = !target.closest(`[data-select-content="${selectId}"]`)
        if (isOutsideContainer && isOutsidePortal) {
          setOpen(false)
        }
      }
      // Use click instead of mousedown to avoid conflicts with button clicks
      document.addEventListener('click', handleClickOutside, true)
      return () => document.removeEventListener('click', handleClickOutside, true)
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

function SelectTrigger({ className, children, onClick, ...props }: SelectTriggerProps) {
  const context = React.useContext(SelectContext)
  
  if (!context) {
    throw new Error('SelectTrigger must be used within Select')
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    context.setOpen(!context.open)
    onClick?.(e)
  }

  return (
    <button
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={handleClick}
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
  children?: React.ReactNode
}

function SelectValue({ placeholder, children }: SelectValueProps) {
  const context = React.useContext(SelectContext)
  
  if (!context) {
    throw new Error('SelectValue must be used within Select')
  }

  // If children are provided, use them (for custom labels)
  if (children) {
    return <span>{children}</span>
  }

  // Otherwise use value or placeholder
  return <span>{context.value || placeholder}</span>
}

interface SelectContentProps {
  children: React.ReactNode
}

function SelectContent({ children }: SelectContentProps) {
  const context = React.useContext(SelectContext)
  const [position, setPosition] = React.useState<{ top: number; left: number; width: number } | null>(null)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  
  if (!context) {
    throw new Error('SelectContent must be used within Select')
  }

  const calculatePosition = React.useCallback(() => {
    // Find the trigger element using the selectId
    const selectContainer = document.querySelector(`[data-select="${context.selectId}"]`)
    if (selectContainer) {
      const trigger = selectContainer.querySelector('button')
      if (trigger) {
        const rect = trigger.getBoundingClientRect()
        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight
        const dropdownHeight = 200 // Estimated dropdown height
        const dropdownWidth = rect.width
        
        // Calculate position with viewport boundaries in mind
        // Account for bottom navbar (approximately 80px)
        const bottomNavHeight = 80
        const availableHeight = viewportHeight - bottomNavHeight
        
        let top = rect.bottom + window.scrollY + 4
        let left = rect.left + window.scrollX
        
        // Check if dropdown would overlap with bottom navbar or go below viewport
        const spaceBelow = availableHeight - rect.bottom
        const spaceAbove = rect.top
        
        // If not enough space below (accounting for bottom nav), show above
        if (spaceBelow < dropdownHeight + 4) {
          // Always prefer showing above if there's not enough space below
          if (spaceAbove >= dropdownHeight) {
            // Show above the trigger
            top = rect.top + window.scrollY - dropdownHeight - 4
          } else {
            // Not enough space above either, position it as high as possible above bottom nav
            top = availableHeight - dropdownHeight + window.scrollY - 4
          }
        }
        
        // If dropdown would go off right edge, align to right edge
        if (left + dropdownWidth > viewportWidth) {
          left = viewportWidth - dropdownWidth - 8
        }
        
        // Ensure dropdown doesn't go off left edge
        if (left < 8) {
          left = 8
        }
        
        return {
          top,
          left,
          width: Math.max(rect.width, 200),
        }
      }
    }
    return null
  }, [context.selectId])

  // Calculate position immediately when opening (useLayoutEffect runs synchronously before paint)
  React.useLayoutEffect(() => {
    if (context.open) {
      // Always set a fallback position first to ensure dropdown is visible
      const fallbackPosition = {
        top: typeof window !== 'undefined' ? window.innerHeight / 2 + window.scrollY : 0,
        left: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
        width: 200,
      }
      setPosition(fallbackPosition)
      
      // Then try to calculate the actual position
      const newPosition = calculatePosition()
      if (newPosition) {
        setPosition(newPosition)
      } else {
        // If position calculation fails, try again on next frame
        const frameId = requestAnimationFrame(() => {
          const retryPosition = calculatePosition()
          if (retryPosition) {
            setPosition(retryPosition)
          }
        })
        return () => cancelAnimationFrame(frameId)
      }
    } else {
      setPosition(null)
    }
  }, [context.open, calculatePosition])

  // Update position on scroll and resize
  React.useEffect(() => {
    if (context.open && position) {
      const updatePosition = () => {
        const newPosition = calculatePosition()
        if (newPosition) {
          setPosition(newPosition)
        }
      }
      
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)
      
      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [context.open, position, calculatePosition])

  // Render dropdown immediately when open, even if position is not yet calculated
  if (!context.open) return null

  // Use a fallback position if position is not yet calculated
  // This ensures the dropdown is always visible, even if position calculation fails
  const finalPosition = position || (() => {
    // Try to get trigger position as fallback
    if (typeof window !== 'undefined') {
      const selectContainer = document.querySelector(`[data-select="${context.selectId}"]`)
      if (selectContainer) {
        const trigger = selectContainer.querySelector('button')
        if (trigger) {
          const rect = trigger.getBoundingClientRect()
          return {
            top: rect.bottom + window.scrollY + 4,
            left: rect.left + window.scrollX,
            width: Math.max(rect.width, 200),
          }
        }
      }
    }
    // Last resort: center of viewport
    return {
      top: typeof window !== 'undefined' ? window.innerHeight / 2 + window.scrollY : 0,
      left: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
      width: 200,
    }
  })()

  const content = (
    <div
      ref={contentRef}
      data-select-content={context.selectId}
      className="fixed z-[100000] min-w-[8rem] overflow-hidden rounded-md border bg-popover border-border shadow-lg"
      style={{
        top: `${finalPosition.top}px`,
        left: `${finalPosition.left}px`,
        width: `${finalPosition.width}px`,
        pointerEvents: 'auto',
        opacity: 1,
        transition: 'opacity 0.1s ease-in-out',
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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    context.onValueChange(value)
    // Use setTimeout to ensure onValueChange is called before closing
    setTimeout(() => {
      context.setOpen(false)
    }, 0)
  }

  return (
    <button
      type="button"
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent",
        isSelected && "bg-accent",
        className
      )}
      onClick={handleClick}
      onMouseDown={(e) => {
        // Prevent mousedown from closing the dropdown before onClick fires
        e.preventDefault()
      }}
      {...props}
    >
      {children}
    </button>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }


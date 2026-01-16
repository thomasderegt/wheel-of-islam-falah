'use client'

import * as React from "react"
import { cn } from "@/shared/utils/cn"

interface ContainerProps extends React.ComponentProps<"div"> {
  /**
   * Variant van de container
   * - default: Standaard container
   * - section: Voor HTML sections
   */
  variant?: "default" | "section"
}

function Container({ 
  className, 
  variant = "default",
  ...props 
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      data-variant={variant}
      className={cn(
        "container", // Basis class voor CSS variabelen
        variant === "section" && "container-section",
        className
      )}
      {...props}
    />
  )
}

export { Container }


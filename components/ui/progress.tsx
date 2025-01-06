'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import styles from './progress.module.css'

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={styles.progressRoot}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={styles.progressIndicator}
      style={{ 
        transform: `translateX(-${100 - (value || 0)}%)`,
      }}
    />
  </ProgressPrimitive.Root>
))

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress } 
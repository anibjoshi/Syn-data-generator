'use client'

import { useEffect } from 'react'
import styles from './toast.module.css'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <p className={styles.message}>{message}</p>
      <button 
        onClick={onClose}
        className={styles.closeButton}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  )
} 
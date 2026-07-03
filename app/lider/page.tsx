'use client'
import { useEffect } from 'react'

export default function LiderPage() {
  useEffect(() => {
    window.location.href = '/dashboard-app'
  }, [])
  return null
}

"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

type ContextType = 'personal' | 'corporate'

interface FinancialContextType {
  context: ContextType
  setContext: (context: ContextType) => void
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined)

export function FinancialProvider({ children }: { children: React.ReactNode }) {
  const [context, setContext] = useState<ContextType>('personal')

  // Optional: persist in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('kadron-context') as ContextType
    if (saved) setContext(saved)
  }, [])

  const handleSetContext = (newContext: ContextType) => {
    setContext(newContext)
    localStorage.setItem('kadron-context', newContext)
  }

  return (
    <FinancialContext.Provider value={{ context, setContext: handleSetContext }}>
      {children}
    </FinancialContext.Provider>
  )
}

export function useFinancial() {
  const context = useContext(FinancialContext)
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider')
  }
  return context
}

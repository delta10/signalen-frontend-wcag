'use client'

import { createContext } from 'react'
import { useConfig } from '@/hooks/useConfig'
import React from 'react'
import { AppConfig } from '@/types/config'

export const AppContext = createContext<{
  config: AppConfig | null
  loading: boolean
  error: Error | null
  refetchConfig: () => Promise<void>
}>({
  config: null,
  loading: true,
  error: null,
  refetchConfig: async () => {},
})

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { config, loading, error, refetch } = useConfig()

  console.log(config)

  return (
    <AppContext.Provider
      value={{
        config,
        loading,
        error,
        refetchConfig: refetch,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

import { useEffect, useState } from 'react'
import { getConfig } from '@/services/config/config'
import { AppConfig } from '@/types/config'

export const useConfig = () => {
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchConfig = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getConfig()
      setConfig(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch config'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  return {
    config,
    loading,
    error,
    refetch: fetchConfig,
  }
}

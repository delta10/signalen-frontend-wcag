import { useEffect } from 'react'
import { useConfig } from '@/contexts/ConfigContext'

/** Start preparing provincial posts before the user searches or opens the map. */
export const usePrefetchHectometers = () => {
  const config = useConfig()
  const enabled = config.base.pdok_hectometer_suggest?.enabled
  const sourceLayerId = config.base.pdok_hectometer_suggest?.sourceLayerId

  useEffect(() => {
    if (!enabled || !sourceLayerId) return

    const params = new URLSearchParams({ sourceLayerId, warmup: 'true' })
    // Keep preparation running when navigating away; search can reuse it.
    // Do not cache this response in the browser: each visit should warm the server.
    void fetch(`/api/hectometers?${params}`, { cache: 'no-store' }).catch(
      () => {
        // A failed warmup must not block the form. The next search retries.
      }
    )
  }, [enabled, sourceLayerId])
}

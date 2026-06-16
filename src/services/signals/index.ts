import { createSignalsClient } from '@/services/client/api-client'
import type { PublicSignalSerializerDetail } from '@/services/client'

export const getPublicSignal = async (
  baseUrl: string,
  signalId: string
): Promise<PublicSignalSerializerDetail | null> => {
  try {
    const signalsClient = createSignalsClient(baseUrl)
    return await signalsClient.v1.v1PublicSignalsRetrieve(signalId)
  } catch {
    return null
  }
}

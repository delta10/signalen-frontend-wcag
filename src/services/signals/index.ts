import { signalsClient } from '@/services/client/api-client'
import type { PublicSignalSerializerDetail } from '@/services/client'

export const getPublicSignal = async (
  signalId: string
): Promise<PublicSignalSerializerDetail | null> => {
  try {
    return await signalsClient.v1.v1PublicSignalsRetrieve(signalId)
  } catch {
    return null
  }
}

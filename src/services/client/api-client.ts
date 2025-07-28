import axios, { AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'
import { request as __request } from '@/services/client/core/request'
import type { OpenAPIConfig } from '../client'
import { BaseHttpRequest, CancelablePromise, SignalsClient } from '../client'
import { ApiRequestOptions } from '@/services/client/core/ApiRequestOptions'
import { getServerConfig } from '../config/config'

export const axiosInstance = async (baseUrl?: string): Promise<AxiosInstance> => {
  const config = await getServerConfig()
  const instance = axios.create({
    baseURL: config?.baseUrlApi ? config?.baseUrlApi : process.env.NEXT_PUBLIC_BASE_URL_API,
  })

  axiosRetry(instance)

  return instance
}

class AxiosHttpRequestWithRetry extends BaseHttpRequest {
  axiosInstance: AxiosInstance | undefined

  constructor(config: OpenAPIConfig) {
    super(config)
    axiosInstance().then(instance => {
      this.axiosInstance = instance
    })
  }

  public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
    if (!this.axiosInstance) {
      throw new Error('Axios instance not initialized yet')
    }
    return __request(this.config, options, this.axiosInstance)
  }
}

export const signalsClient = new SignalsClient(
  { BASE: '' },
  AxiosHttpRequestWithRetry
)

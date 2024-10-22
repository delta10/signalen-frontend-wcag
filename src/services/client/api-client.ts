import axios, { AxiosInstance } from 'axios'
import axiosRetry from 'axios-retry'
import { request as __request } from '@/services/client/core/request'
import type { OpenAPIConfig } from '../client'
import { BaseHttpRequest, CancelablePromise, SignalsClient } from '../client'
import { ApiRequestOptions } from '@/services/client/core/ApiRequestOptions'

export const axiosInstance = (baseUrl?: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseUrl ? baseUrl : process.env.NEXT_PUBLIC_BASE_URL_API,
  })

  axiosRetry(instance)

  return instance
}

class AxiosHttpRequestWithRetry extends BaseHttpRequest {
  axiosInstance: AxiosInstance

  constructor(config: OpenAPIConfig) {
    super(config)
    this.axiosInstance = axiosInstance()
  }

  public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
    return __request(this.config, options, this.axiosInstance)
  }
}

export const signalsClient = new SignalsClient(
  { BASE: '' },
  AxiosHttpRequestWithRetry
)

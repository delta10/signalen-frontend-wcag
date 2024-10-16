import axios from 'axios'
import axiosRetry from 'axios-retry'
import { request as __request } from '@/services/client/core/request'
import type { OpenAPIConfig } from '../client'
import { BaseHttpRequest, CancelablePromise, SignalsClient } from '../client'
import { ApiRequestOptions } from '@/services/client/core/ApiRequestOptions'

class AxiosHttpRequestWithRetry extends BaseHttpRequest {
  axiosInstance = axios.create({
    headers: {
      Authorization: 'Bearer ' + process.env.TESTING_PURPOSES_API_KEY,
    },
  })

  constructor(config: OpenAPIConfig) {
    super(config)
    axiosRetry(this.axiosInstance)
  }

  public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
    return __request(this.config, options, this.axiosInstance)
  }
}

export const client = new SignalsClient(
  { BASE: process.env.NEXT_PUBLIC_BASE_URL_API },
  AxiosHttpRequestWithRetry
)

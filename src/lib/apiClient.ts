import axios from 'axios'
import axiosRetry from 'axios-retry'
import { request as __request } from '../sdk/core/request'
import type { OpenAPIConfig } from '../sdk/core/OpenAPI'
import { BaseHttpRequest, CancelablePromise, SignalsClient } from '@/sdk'
import { ApiRequestOptions } from '@/sdk/core/ApiRequestOptions'

class AxiosHttpRequestWithRetry extends BaseHttpRequest {
  axiosInstance = axios.create()

  constructor(config: OpenAPIConfig) {
    super(config)
    axiosRetry(this.axiosInstance)
  }

  public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
    return __request(this.config, options, this.axiosInstance)
  }
}

const client = new SignalsClient(
  { BASE: process.env.BASE_URL_API },
  AxiosHttpRequestWithRetry
)

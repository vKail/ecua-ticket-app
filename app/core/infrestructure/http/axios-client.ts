
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'
import { HttpHandler, HttpResponse } from '../../interfaces/HttpHandler'
import { addToast } from '@heroui/toast'
import { NETWORK_ERROR_RESPONSE } from '../../constants/network-api-response'

export class AxiosClient implements HttpHandler {
  private static instance: AxiosClient
  private axiosInstance: AxiosInstance
  private static readonly baseURL =
    process.env.EXPO_PUBLIC_BACKEND_API_URL || ''
  private accessToken: string | null = null

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: AxiosClient.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.axiosInstance.interceptors.request.use((config) => {
      console.log('📡 Axios Request:', {
        url: AxiosClient.baseURL + config.url,
        method: config.method,
        headers: config.headers,
        data: config.data,
      })
      return config
    })

    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (response.config.method !== 'get') {
          addToast({
            title: 'Exito',
            description: response.data.message, 
            color: 'success',
          })
        }
        return response
      },
      (error) => {
        if (!error.response) {
          addToast({
            title: 'Error',
            description: 'Network Error',
            color: 'danger',
          })
        } else {
          addToast({
            title: 'Error',
            description: error.response.data.message,
            color: 'danger',
          })
        }
        if (error.response?.status === 401) {
        }
        return Promise.reject(error)
      }
    )
  }

  static getInstance(): AxiosClient {
    if (!this.instance) {
      this.instance = new AxiosClient()
    }
    return this.instance
  }

  setAccessToken(accessToken: string | null): void {
    if (accessToken) {
      this.axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${accessToken}`
    } else {
      delete this.axiosInstance.defaults.headers.common['Authorization']
    }
  }

  getToken(): string | null {
    return this.accessToken
  }

  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance
  }

  async get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      const response = await this.axiosInstance.get<HttpResponse<T>>(
        url,
        config
      )
      return response.data
    } catch (e: any) {
      if (!e.response) return NETWORK_ERROR_RESPONSE
      return e.response.data
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      const response = await this.axiosInstance.post<HttpResponse<T>>(
        url,
        data,
        config ? config : {}
      )
      return response.data
    } catch (e: any) {
      if (!e.response) return NETWORK_ERROR_RESPONSE
      return e.response.data
    }
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      const response = await this.axiosInstance.put<HttpResponse<T>>(
        url,
        data,
        config
      )
      return response.data
    } catch (e: any) {
      if (!e.response) return NETWORK_ERROR_RESPONSE
      return e.response.data
    }
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      const response = await this.axiosInstance.patch<HttpResponse<T>>(
        url,
        data,
        config
      )
      return response.data
    } catch (e: any) {
      if (!e.response) return NETWORK_ERROR_RESPONSE
      return e.response.data
    }
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<HttpResponse<T>> {
    try {
      const response = await this.axiosInstance.delete<HttpResponse<T>>(
        url,
        config
      )
      return response.data
    } catch (e: any) {
      if (!e.response) return NETWORK_ERROR_RESPONSE
      return e.response.data
    }
  }
}
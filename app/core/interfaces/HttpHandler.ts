export interface HttpHandler {
    get<T>(url: string, config?: any): Promise<HttpResponse<T>>
    post<T>(url: string, data: any, config?: any): Promise<HttpResponse<T>>
    put<T>(url: string, data: any, config?: any): Promise<HttpResponse<T>>
    patch<T>(url: string, data?: any, config?: any): Promise<HttpResponse<T>>
    delete<T>(url: string, config?: any): Promise<HttpResponse<T>>
    setAccessToken(accessToken: string | null): void
    getToken(): string | null
  }
  
  export interface HttpResponse<T> {
    success: boolean
    message: string
    data: T
    statusCode: number
    metadata: any
  }
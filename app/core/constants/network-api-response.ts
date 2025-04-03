import { HttpResponse } from '../interfaces/HttpHandler'

export const NETWORK_ERROR_RESPONSE: HttpResponse<any> = {
  success: false,
  message: 'No se pudo establecer conexión con el servidor',
  data: null,
  statusCode: 0,
  metadata: null,
} as const
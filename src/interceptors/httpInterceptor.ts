import { getEnvironment } from '../environments/environment';
import { HttpMethod, HttpRequestOptions, NetworkLog } from '../models/api.model';
import { storage } from '../utils/storage';

type NetworkListener = (log: NetworkLog) => void;
type ErrorHandler = (error: { status: number; message: string; method: string; url: string }) => void;

class HttpClient {
  private networkListeners: NetworkListener[] = [];
  private errorHandlers: ErrorHandler[] = [];
  private logs: NetworkLog[] = [];
  private simulatedFault: { status: number; message: string } | null = null;
  private simulatedLatencyMs: number = 300;

  // Permite al laboratorio suscribirse a eventos de red en tiempo real
  public onLog(listener: NetworkListener): () => void {
    this.networkListeners.push(listener);
    return () => {
      this.networkListeners = this.networkListeners.filter((l) => l !== listener);
    };
  }

  public onError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler);
    return () => {
      this.errorHandlers = this.errorHandlers.filter((h) => h !== handler);
    };
  }

  public getLogs(): NetworkLog[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
  }

  public setSimulatedFault(fault: { status: number; message: string } | null) {
    this.simulatedFault = fault;
  }

  public getSimulatedFault() {
    return this.simulatedFault;
  }

  public setLatency(ms: number) {
    this.simulatedLatencyMs = ms;
  }

  public getLatency(): number {
    return this.simulatedLatencyMs;
  }

  // INTERCEPTOR DE PETICIÓN (Request Interceptor)
  private applyRequestInterceptors(url: string, options: HttpRequestOptions = {}): {
    fullUrl: string;
    headers: Record<string, string>;
  } {
    const env = getEnvironment();
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    const fullUrl = `${env.apiUrl}${cleanUrl}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-App-Client': 'React-Course-Store/1.0',
      'X-Environment': env.envName,
      ...(options.headers || {}),
    };

    // Agregar automáticamente Authorization: Bearer TOKEN antes de cada petición
    const token = storage.get<string | null>('mitienda_auth_token', null);
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Agregar query params si existen
    let finalUrl = fullUrl;
    if (options.params) {
      const queryParts: string[] = [];
      Object.entries(options.params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          queryParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`);
        }
      });
      if (queryParts.length > 0) {
        finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryParts.join('&');
      }
    }

    return { fullUrl: finalUrl, headers };
  }

  // INTERCEPTOR DE RESPUESTA (Response Interceptor)
  private handleResponseStatus(status: number, message: string, method: string, url: string) {
    // Manejo centralizado de códigos HTTP
    switch (status) {
      case 200:
      case 201:
      case 204:
        // Petición exitosa
        break;
      case 400:
        this.notifyError(400, message || 'Datos incorrectos o incompletos en la solicitud', method, url);
        break;
      case 401:
        // Sesión expirada o no autenticado -> Limpiar sesión y notificar
        storage.remove('mitienda_auth_token');
        storage.remove('mitienda_current_user');
        this.notifyError(401, 'Sesión expirada o token inválido. Por favor inicia sesión nuevamente.', method, url);
        break;
      case 403:
        this.notifyError(403, 'Acceso denegado: No tienes permisos de administrador para realizar esta acción.', method, url);
        break;
      case 404:
        this.notifyError(404, message || 'El recurso solicitado no fue encontrado en el servidor.', method, url);
        break;
      case 500:
      default:
        this.notifyError(status || 500, message || 'Error interno del servidor. Por favor intenta más tarde.', method, url);
        break;
    }
  }

  private notifyError(status: number, message: string, method: string, url: string) {
    this.errorHandlers.forEach((h) => {
      try {
        h({ status, message, method, url });
      } catch (err) {
        console.error('Error in error handler:', err);
      }
    });
  }

  private recordLog(log: NetworkLog) {
    this.logs.unshift(log);
    if (this.logs.length > 50) this.logs.pop();
    this.networkListeners.forEach((listener) => {
      try {
        listener(log);
      } catch (e) {
        console.error(e);
      }
    });
  }

  // Núcleo de ejecución de peticiones
  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: any,
    options: HttpRequestOptions = {}
  ): Promise<T> {
    const startTime = performance.now();
    const { fullUrl, headers } = this.applyRequestInterceptors(endpoint, options);

    // Simulación de latencia realista de red
    if (this.simulatedLatencyMs > 0) {
      await new Promise((r) => setTimeout(r, this.simulatedLatencyMs));
    }

    // Inyección de fallo simulado si fue activado en el laboratorio para ver cómo responde el interceptor
    if (this.simulatedFault) {
      const fault = this.simulatedFault;
      const durationMs = Math.round(performance.now() - startTime);

      const log: NetworkLog = {
        id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toLocaleTimeString(),
        method,
        url: fullUrl,
        status: fault.status,
        statusText: fault.status === 401 ? 'Unauthorized' : fault.status === 403 ? 'Forbidden' : fault.status === 404 ? 'Not Found' : 'Internal Server Error',
        headers,
        payload: body,
        response: { error: fault.message, status: fault.status },
        durationMs,
        error: true,
      };

      this.recordLog(log);
      this.handleResponseStatus(fault.status, fault.message, method, fullUrl);

      const err = new Error(fault.message) as any;
      err.status = fault.status;
      err.response = { data: { message: fault.message, status: fault.status } };
      throw err;
    }

    // Procesar con el Mock REST Controller local persistente (o fetch real si estuviera configurado)
    try {
      const result = await this.mockServerRouter(method, endpoint, body, headers, options);
      const durationMs = Math.round(performance.now() - startTime);

      const log: NetworkLog = {
        id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toLocaleTimeString(),
        method,
        url: fullUrl,
        status: result.status,
        statusText: result.status === 201 ? 'Created' : 'OK',
        headers,
        payload: body,
        response: result.data,
        durationMs,
        error: false,
      };

      this.recordLog(log);
      this.handleResponseStatus(result.status, '', method, fullUrl);
      return result.data as T;
    } catch (error: any) {
      const durationMs = Math.round(performance.now() - startTime);
      const status = error.status || 500;
      const message = error.message || 'Error en la petición';

      const log: NetworkLog = {
        id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toLocaleTimeString(),
        method,
        url: fullUrl,
        status,
        statusText: status === 404 ? 'Not Found' : status === 401 ? 'Unauthorized' : 'Error',
        headers,
        payload: body,
        response: { error: message, status },
        durationMs,
        error: true,
      };

      this.recordLog(log);
      this.handleResponseStatus(status, message, method, fullUrl);
      throw error;
    }
  }

  // Router REST local para el backend simulado
  private async mockServerRouter(
    method: HttpMethod,
    endpoint: string,
    body: any,
    headers: Record<string, string>,
    options: HttpRequestOptions
  ): Promise<{ status: number; data: any }> {
    const { mockBackendHandler } = await import('./mockBackend');
    return mockBackendHandler(method, endpoint, body, headers, options.params);
  }

  // Métodos estándar del cliente HTTP
  public get<T>(url: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('GET', url, undefined, options);
  }

  public post<T>(url: string, data?: any, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('POST', url, data, options);
  }

  public put<T>(url: string, data?: any, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('PUT', url, data, options);
  }

  public patch<T>(url: string, data?: any, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('PATCH', url, data, options);
  }

  public delete<T>(url: string, options?: HttpRequestOptions): Promise<T> {
    return this.request<T>('DELETE', url, undefined, options);
  }
}

// Exportar cliente HTTP singleton
export const http = new HttpClient();

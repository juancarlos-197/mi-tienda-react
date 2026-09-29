export interface EnvironmentConfig {
  appName: string;
  apiUrl: string;
  envName: 'development' | 'production' | 'test';
  enableMockServer: boolean;
  enableLogger: boolean;
  apiTimeout: number;
}

export const environmentDev: EnvironmentConfig = {
  appName: 'Mi Tienda React (Desarrollo)',
  apiUrl: 'http://localhost:3000/api',
  envName: 'development',
  enableMockServer: true,
  enableLogger: true,
  apiTimeout: 3000,
};

export const environmentProd: EnvironmentConfig = {
  appName: 'Mi Tienda React (Producción)',
  apiUrl: 'https://api.mitienda-react.com/api',
  envName: 'production',
  enableMockServer: false,
  enableLogger: false,
  apiTimeout: 10000,
};

// Variable activa leída desde import.meta.env de Vite con fallback
const isProd = import.meta.env.PROD;

export const defaultEnvironment: EnvironmentConfig = {
  appName: import.meta.env.VITE_APP_NAME || (isProd ? environmentProd.appName : environmentDev.appName),
  apiUrl: import.meta.env.VITE_API_URL || (isProd ? environmentProd.apiUrl : environmentDev.apiUrl),
  envName: (import.meta.env.VITE_ENV_NAME as any) || (isProd ? 'production' : 'development'),
  enableMockServer: import.meta.env.VITE_ENABLE_MOCK_SERVER === 'false' ? false : true,
  enableLogger: import.meta.env.VITE_ENABLE_LOGGER === 'false' ? false : true,
  apiTimeout: Number(import.meta.env.VITE_API_TIMEOUT) || 4000,
};

// Singleton para permitir cambiar ambientes interactivamente en el laboratorio didáctico
let currentEnvironment = { ...defaultEnvironment };

export const getEnvironment = (): EnvironmentConfig => currentEnvironment;

export const setEnvironmentMode = (mode: 'development' | 'production') => {
  if (mode === 'production') {
    currentEnvironment = { ...environmentProd };
  } else {
    currentEnvironment = { ...environmentDev };
  }
  return currentEnvironment;
};

import { Activity, AlertTriangle, CheckCircle, Clock, Copy, RefreshCw, Shield, Trash2, Wifi } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getEnvironment, setEnvironmentMode } from '../../environments/environment';
import { http } from '../../interceptors/httpInterceptor';
import { NetworkLog } from '../../models/api.model';
import { useNotification } from '../../context/NotificationContext';

export const HttpNetworkInspector: React.FC = () => {
  const [logs, setLogs] = useState<NetworkLog[]>(() => http.getLogs());
  const [selectedLog, setSelectedLog] = useState<NetworkLog | null>(null);
  const [latency, setLatency] = useState<number>(() => http.getLatency());
  const [simulatedFault, setFaultState] = useState<{ status: number; message: string } | null>(
    () => http.getSimulatedFault()
  );
  const [activeEnv, setActiveEnv] = useState<'development' | 'production'>('development');
  const { success, info } = useNotification();

  useEffect(() => {
    const unsubscribe = http.onLog((newLog) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
    });
    return unsubscribe;
  }, []);

  const handleClear = () => {
    http.clearLogs();
    setLogs([]);
    setSelectedLog(null);
  };

  const handleLatencyChange = (ms: number) => {
    setLatency(ms);
    http.setLatency(ms);
    info(`Latencia simulada ajustada a ${ms}ms`);
  };

  const handleSetFault = (status: number, message: string) => {
    const fault = { status, message };
    http.setSimulatedFault(fault);
    setFaultState(fault);
    info(`Inyector de fallos activado: HTTP ${status}`);
  };

  const handleClearFault = () => {
    http.setSimulatedFault(null);
    setFaultState(null);
    success('Interconexión REST normal restablecida (sin fallos)');
  };

  const handleEnvToggle = (mode: 'development' | 'production') => {
    setActiveEnv(mode);
    setEnvironmentMode(mode);
    success(`Entorno cambiado a: ${mode.toUpperCase()} (${getEnvironment().apiUrl})`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    success('Copiado al portapapeles');
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[700px]">
      {/* Top Inspector Bar */}
      <div className="p-4 bg-neutral-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h3 className="font-bold text-sm">Inspector HTTP & Interceptor en Vivo</h3>
          <span className="text-2xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono">
            {logs.length} peticiones
          </span>
        </div>

        {/* Fault & Latency quick controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-neutral-400">Latencia:</span>
            <select
              value={latency}
              onChange={(e) => handleLatencyChange(Number(e.target.value))}
              className="bg-neutral-700 text-white text-xs rounded px-1 py-0.5 focus:outline-none"
            >
              <option value="0">0ms (Instantáneo)</option>
              <option value="300">300ms (Normal)</option>
              <option value="800">800ms (3G Rápido)</option>
              <option value="1500">1500ms (Lento)</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded">
            <Wifi className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-neutral-400">Ambiente:</span>
            <button
              onClick={() => handleEnvToggle(activeEnv === 'development' ? 'production' : 'development')}
              className="font-mono text-2xs text-blue-300 hover:underline uppercase"
            >
              {activeEnv}
            </button>
          </div>

          <button
            onClick={handleClear}
            className="flex items-center gap-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white px-2.5 py-1 rounded text-xs transition-colors"
          >
            <Trash2 className="w-3 h-3" /> Limpiar
          </button>
        </div>
      </div>

      {/* Lab Simulation Bar */}
      <div className="p-3 bg-neutral-100 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="font-semibold text-neutral-700 dark:text-neutral-200">
            Laboratorio de Interceptores:
          </span>
          <span className="text-neutral-500">
            Prueba cómo reacciona la app ante respuestas de error del backend:
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {simulatedFault ? (
            <button
              onClick={handleClearFault}
              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3" /> Quitar Fallo Activo ({simulatedFault.status})
            </button>
          ) : (
            <>
              <button
                onClick={() => handleSetFault(401, 'Token JWT vencido o ausente')}
                className="px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-300 rounded font-mono text-2xs"
              >
                Inyectar 401 (Auth)
              </button>
              <button
                onClick={() => handleSetFault(403, 'Rol de usuario sin permisos para esta ruta')}
                className="px-2 py-1 bg-orange-100 hover:bg-orange-200 text-orange-900 dark:bg-orange-950 dark:text-orange-300 rounded font-mono text-2xs"
              >
                Inyectar 403 (Permisos)
              </button>
              <button
                onClick={() => handleSetFault(500, 'Database connection timeout')}
                className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-900 dark:bg-rose-950 dark:text-rose-300 rounded font-mono text-2xs"
              >
                Inyectar 500 (Servidor)
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Split View: Logs List (Left) and Detail Inspector (Right) */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Logs Table / List */}
        <div className="md:col-span-6 border-r border-neutral-200 dark:border-neutral-800 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-neutral-400 space-y-2">
              <RefreshCw className="w-8 h-8 mx-auto text-neutral-300 animate-spin" />
              <p className="text-xs">No hay peticiones registradas aún.</p>
              <p className="text-2xs">
                Interactúa con la tienda, crea un producto o agrega ítems al carrito para ver el tráfico HTTP en vivo.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono text-xs">
              {logs.map((log) => {
                const isSelected = selectedLog?.id === log.id;
                const methodColor = {
                  GET: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
                  POST: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
                  PUT: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60',
                  PATCH: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60',
                  DELETE: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60',
                }[log.method] || 'text-neutral-600 bg-neutral-100';

                const statusColor =
                  log.status >= 200 && log.status < 300
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : log.status >= 400 && log.status < 500
                    ? 'text-amber-600 dark:text-amber-400 font-bold'
                    : 'text-rose-600 dark:text-rose-400 font-bold';

                return (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className={`w-full text-left p-2.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-50/70 dark:bg-neutral-800' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-1.5 py-0.5 rounded text-2xs font-bold ${methodColor}`}>
                        {log.method}
                      </span>
                      <span className="truncate text-neutral-800 dark:text-neutral-200">
                        {log.url.replace(/^https?:\/\/[^/]+/, '')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-2xs">
                      <span className={statusColor}>{log.status}</span>
                      <span className="text-neutral-400">{log.durationMs}ms</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Log Details */}
        <div className="md:col-span-6 bg-neutral-50/40 dark:bg-neutral-900/40 overflow-y-auto p-4 space-y-4">
          {selectedLog ? (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {selectedLog.method} {selectedLog.url}
                  </span>
                </div>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(selectedLog, null, 2))}
                  className="p-1 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                  title="Copiar JSON"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Status and timing */}
              <div className="grid grid-cols-3 gap-2 text-2xs">
                <div className="p-2 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-400 block">Status</span>
                  <span className={`font-bold ${selectedLog.status < 400 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {selectedLog.status} {selectedLog.statusText}
                  </span>
                </div>
                <div className="p-2 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-400 block">Duración</span>
                  <span className="font-semibold">{selectedLog.durationMs} ms</span>
                </div>
                <div className="p-2 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-400 block">Hora</span>
                  <span>{selectedLog.timestamp}</span>
                </div>
              </div>

              {/* Headers with Bearer Token Highlight */}
              <div>
                <h4 className="font-bold text-neutral-700 dark:text-neutral-300 text-2xs uppercase tracking-wider mb-1">
                  Request Headers (Inyectadas por Interceptor)
                </h4>
                <div className="p-2.5 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 space-y-1 text-2xs overflow-x-auto">
                  {Object.entries(selectedLog.headers).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-neutral-500 font-semibold">{k}:</span>
                      <span
                        className={`truncate ${
                          k.toLowerCase() === 'authorization'
                            ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1 rounded'
                            : 'text-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Payload */}
              {selectedLog.payload && (
                <div>
                  <h4 className="font-bold text-neutral-700 dark:text-neutral-300 text-2xs uppercase tracking-wider mb-1">
                    Request Payload (Body enviado)
                  </h4>
                  <pre className="p-2.5 bg-white dark:bg-neutral-800 rounded border border-neutral-200 dark:border-neutral-700 text-2xs overflow-x-auto text-neutral-800 dark:text-neutral-200">
                    {JSON.stringify(selectedLog.payload, null, 2)}
                  </pre>
                </div>
              )}

              {/* Response Data */}
              <div>
                <h4 className="font-bold text-neutral-700 dark:text-neutral-300 text-2xs uppercase tracking-wider mb-1">
                  Response Data (Respuesta del Backend)
                </h4>
                <pre
                  className={`p-2.5 rounded border text-2xs overflow-x-auto ${
                    selectedLog.error
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
                      : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {JSON.stringify(selectedLog.response, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center p-8 text-neutral-400">
              <p className="text-xs">
                Selecciona una petición en la lista de la izquierda para inspeccionar sus encabezados, Authorization Bearer y cuerpo de respuesta.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

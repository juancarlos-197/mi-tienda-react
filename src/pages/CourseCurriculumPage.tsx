import { BookOpen, Check, CheckCircle2, ChevronRight, Code2, Copy, ExternalLink, Play, Sparkles, Terminal } from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { COURSE_MODULES, CourseModule } from '../data/courseCurriculum';
import { getEnvironment, setEnvironmentMode } from '../environments/environment';
import { http } from '../interceptors/httpInterceptor';
import { useNotification } from '../context/NotificationContext';
import { validators } from '../utils/validators';
import { useForm } from '../hooks/useForm';

interface CourseCurriculumPageProps {
  onNavigateToStore: () => void;
  onNavigateToAdmin: () => void;
  onNavigateToInspector: () => void;
}

export const CourseCurriculumPage: React.FC<CourseCurriculumPageProps> = ({
  onNavigateToStore,
  onNavigateToAdmin,
  onNavigateToInspector,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<number>(1);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { success, error, warning } = useNotification();

  const activeModule: CourseModule =
    COURSE_MODULES.find((m) => m.id === selectedModuleId) || COURSE_MODULES[0];

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    success('Código copiado al portapapeles');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-2xs font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Plan de Estudios Completo & Arquitectura Profesional</span>
          </div>
          <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
            Curso: Aplicación Completa con React
          </h1>
          <p className="text-xs text-neutral-500">
            15 Módulos prácticos explicados paso a paso con código fuente, teoría y laboratorios en vivo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToStore}
            className="px-3.5 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Ir a la Tienda
          </button>
          <button
            onClick={onNavigateToInspector}
            className="px-3.5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Inspector HTTP
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar of 15 Modules (Left) and Content Details (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Modules Sidebar */}
        <aside className="lg:col-span-4 space-y-2">
          <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xs">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
              Ruta del Curso ({COURSE_MODULES.length} Módulos)
            </h3>
            <div className="space-y-1.5 max-h-[720px] overflow-y-auto pr-1">
              {COURSE_MODULES.map((m) => {
                const isSelected = m.id === selectedModuleId;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedModuleId(m.id)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-between group ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xs font-semibold'
                        : 'bg-neutral-50/60 dark:bg-neutral-800/40 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-2xs font-mono shrink-0 ${
                          isSelected
                            ? 'bg-white/20 dark:bg-neutral-900/20 text-white dark:text-neutral-900'
                            : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                        }`}
                      >
                        {m.id}
                      </span>
                      <span className="truncate">{m.title.replace(/^Módulo \d+:\s*/, '')}</span>
                    </div>

                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isSelected ? 'translate-x-0.5 text-blue-400' : 'text-neutral-400 opacity-60'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Module Content Detail */}
        <main className="lg:col-span-8 space-y-6">
          <article className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-6">
            {/* Header info */}
            <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-2xs font-bold uppercase tracking-wider rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {activeModule.badge}
                </span>
                <span className="text-2xs text-neutral-400 font-mono">
                  Módulo {activeModule.id} de 15
                </span>
              </div>

              <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                {activeModule.title}
              </h2>

              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {activeModule.summary}
              </p>
            </div>

            {/* Learning Objectives */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 space-y-2">
              <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Objetivos de Aprendizaje:</span>
              </h4>
              <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
                {activeModule.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">·</span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Interactive Playground for this module if applicable */}
            {activeModule.interactiveDemoId && (
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-3">
                  <Play className="w-4 h-4 text-blue-500 fill-current" />
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    Laboratorio Interactivo del Módulo
                  </h3>
                </div>

                <InteractivePlayground demoId={activeModule.interactiveDemoId} />
              </div>
            )}

            {/* Topics & Code Snippets */}
            <div className="space-y-6 pt-2">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-500" />
                <span>Temas & Ejemplos de Código</span>
              </h3>

              {activeModule.topics.map((topic, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3"
                >
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {topic.title}
                    </h4>
                    <span className="text-2xs text-neutral-400">{topic.description}</span>
                  </div>

                  <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    {topic.explanation}
                  </p>

                  {topic.codeSnippet && (
                    <div className="relative rounded-lg overflow-hidden border border-neutral-800 bg-neutral-950">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900 text-neutral-400 text-2xs font-mono border-b border-neutral-800">
                        <span className="flex items-center gap-1.5">
                          <Terminal className="w-3 h-3 text-emerald-400" />
                          <span>Código del curso</span>
                        </span>
                        <button
                          onClick={() => handleCopyCode(topic.codeSnippet!, index)}
                          className="hover:text-white inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copiado</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 text-2xs font-mono text-neutral-200 overflow-x-auto leading-relaxed">
                        {topic.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {topic.practicalTip && (
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg text-2xs text-amber-800 dark:text-amber-300">
                      <strong>💡 Consejo práctico: </strong>
                      {topic.practicalTip}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Files associated in this project */}
            {activeModule.filesInApp.length > 0 && (
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                <span className="text-2xs font-semibold uppercase text-neutral-400 tracking-wider">
                  Archivos correspondientes en este repositorio:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeModule.filesInApp.map((file) => (
                    <code
                      key={file}
                      className="px-2 py-0.5 rounded text-2xs font-mono bg-neutral-100 dark:bg-neutral-800 text-blue-600 dark:text-blue-400"
                    >
                      {file}
                    </code>
                  ))}
                </div>
              </div>
            )}
          </article>
        </main>
      </div>
    </div>
  );
};

// Subcomponente de Laboratorios Interactivos
function InteractivePlayground({ demoId }: { demoId: string }) {
  const { success, warning, error } = useNotification();

  // Demo 1: State & Counter (Módulo 1)
  const [count, setCount] = useState(0);
  const [inputText, setInputText] = useState('React 19');

  // Demo 2: Hooks (Módulo 3)
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  const [numberA, setNumberA] = useState(15);
  const [numberB, setNumberB] = useState(25);
  const calculatedSum = useMemo(() => {
    return numberA * numberB;
  }, [numberA, numberB]);

  // Demo 4: Interceptor (Módulo 7)
  const [isCallingHttp, setIsCallingHttp] = useState(false);
  const [lastResponse, setLastResponse] = useState<any>(null);

  // Demo 5: Environment (Módulo 6)
  const env = getEnvironment();
  const [envMode, setEnvMode] = useState(env.envName);

  // Demo 6: Form Validation (Módulo 11)
  const testForm = useForm(
    { email: '', price: 100 },
    {
      email: [validators.required('Email es requerido'), validators.email('Formato no válido')],
      price: [validators.required(), validators.minNumber(50, 'Mínimo 50 USD')],
    },
    (values) => {
      success(`¡Formulario validado! Email: ${values.email}, Precio: $${values.price}`);
    }
  );

  const handleTestHttp = async (simulateError?: number) => {
    setIsCallingHttp(true);
    if (simulateError) {
      http.setSimulatedFault({
        status: simulateError,
        message: `Fallo forzado de prueba para observar el interceptor HTTP ${simulateError}`,
      });
    } else {
      http.setSimulatedFault(null);
    }

    try {
      const data = await http.get('/products?limit=2');
      setLastResponse(data);
      success('Petición completada con éxito');
    } catch (err: any) {
      setLastResponse({ error: err.message, status: err.status });
    } finally {
      setIsCallingHttp(false);
      http.setSimulatedFault(null);
    }
  };

  if (demoId === 'state-playground') {
    return (
      <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-4">
        <div className="text-xs text-neutral-600 dark:text-neutral-300">
          Prueba el estado reactivo con <code>useState</code>. Cada modificación re-renderiza el componente de forma controlada:
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border rounded-lg p-1.5">
            <button
              onClick={() => setCount((c) => c - 1)}
              className="px-2 py-1 text-xs font-bold rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200"
            >
              -
            </button>
            <span className="px-3 text-xs font-mono font-bold min-w-8 text-center">{count}</span>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="px-2 py-1 text-xs font-bold rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200"
            >
              +
            </button>
          </div>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border rounded-lg"
            placeholder="Texto reactivo..."
          />

          <span className="text-xs text-neutral-500">
            Vista previa: <strong>{inputText}</strong> (Contador: {count})
          </span>
        </div>
      </div>
    );
  }

  if (demoId === 'hooks-playground') {
    return (
      <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg border">
            <span className="text-2xs font-semibold text-neutral-500 block mb-1">
              useMemo (Cálculo memorizado):
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={numberA}
                onChange={(e) => setNumberA(Number(e.target.value))}
                className="w-16 p-1 border rounded text-xs"
              />
              <span>×</span>
              <input
                type="number"
                value={numberB}
                onChange={(e) => setNumberB(Number(e.target.value))}
                className="w-16 p-1 border rounded text-xs"
              />
              <span>=</span>
              <strong className="text-blue-600 font-mono text-sm">{calculatedSum}</strong>
            </div>
          </div>

          <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg border">
            <span className="text-2xs font-semibold text-neutral-500 block mb-1">
              useRef (Render Count sin re-renderizar):
            </span>
            <p className="text-xs">
              Este componente ha renderizado{' '}
              <strong className="text-emerald-600 font-mono">{renderCountRef.current}</strong> veces.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (demoId === 'interceptor-demo') {
    return (
      <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-3 text-xs">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTestHttp()}
            disabled={isCallingHttp}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
          >
            {isCallingHttp ? 'Consultando...' : 'Petición Normal (200 OK)'}
          </button>
          <button
            onClick={() => handleTestHttp(401)}
            disabled={isCallingHttp}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
          >
            Disparar 401 (Sesión Expirada)
          </button>
          <button
            onClick={() => handleTestHttp(403)}
            disabled={isCallingHttp}
            className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold"
          >
            Disparar 403 (Sin Permisos)
          </button>
          <button
            onClick={() => handleTestHttp(500)}
            disabled={isCallingHttp}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
          >
            Disparar 500 (Error Servidor)
          </button>
        </div>

        {lastResponse && (
          <pre className="p-3 bg-neutral-950 text-neutral-100 rounded-lg text-2xs overflow-x-auto font-mono">
            {JSON.stringify(lastResponse, null, 2)}
          </pre>
        )}
      </div>
    );
  }

  if (demoId === 'env-demo') {
    return (
      <div className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-3 text-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEnvironmentMode('development');
              setEnvMode('development');
              success('Cambiado a modo Desarrollo');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              envMode === 'development'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'bg-neutral-200 dark:bg-neutral-700'
            }`}
          >
            .env.development
          </button>
          <button
            onClick={() => {
              setEnvironmentMode('production');
              setEnvMode('production');
              success('Cambiado a modo Producción');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              envMode === 'production'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                : 'bg-neutral-200 dark:bg-neutral-700'
            }`}
          >
            .env.production
          </button>
        </div>

        <div className="p-3 bg-white dark:bg-neutral-900 rounded-lg border font-mono text-2xs space-y-1">
          <div>VITE_ENV_NAME: <span className="text-blue-500 font-bold">{getEnvironment().envName}</span></div>
          <div>VITE_API_URL: <span className="text-emerald-500 font-bold">{getEnvironment().apiUrl}</span></div>
          <div>VITE_APP_NAME: <span className="text-neutral-500">{getEnvironment().appName}</span></div>
        </div>
      </div>
    );
  }

  if (demoId === 'form-demo') {
    return (
      <form onSubmit={testForm.handleSubmit} className="p-4 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700 space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-2xs font-semibold mb-1">Correo electrónico</label>
            <input
              type="text"
              name="email"
              value={testForm.values.email}
              onChange={testForm.handleChange}
              onBlur={testForm.handleBlur}
              placeholder="alumno@ejemplo.com"
              className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white dark:bg-neutral-900"
            />
            {testForm.touched.email && testForm.errors.email && (
              <p className="text-2xs text-rose-500 mt-1">{testForm.errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-2xs font-semibold mb-1">Precio (Mínimo 50)</label>
            <input
              type="number"
              name="price"
              value={testForm.values.price}
              onChange={testForm.handleChange}
              onBlur={testForm.handleBlur}
              className="w-full px-2.5 py-1.5 text-xs border rounded-lg bg-white dark:bg-neutral-900"
            />
            {testForm.touched.price && testForm.errors.price && (
              <p className="text-2xs text-rose-500 mt-1">{testForm.errors.price}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
        >
          Validar Formulario con useForm()
        </button>
      </form>
    );
  }

  return null;
}

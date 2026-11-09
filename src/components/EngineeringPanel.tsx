import React from 'react';
import { USER_STORIES } from '../data/projectData';
import { CheckCircle2, XCircle, Layers, ClipboardCheck, BookOpen, Award, Code } from 'lucide-react';

export const EngineeringPanel: React.FC = () => {
  const totalCriteria = USER_STORIES.reduce((acc, hu) => acc + hu.criteria.length, 0);
  const passedCriteria = USER_STORIES.reduce(
    (acc, hu) => acc + hu.criteria.filter((c) => c.status === 'Cumple').length,
    0
  );

  return (
    <div className="space-y-8">
      {/* Encabezado Académico */}
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-3">
              <Award className="w-3.5 h-3.5" /> Ingeniería de Software • Actividad 4 y Preparación Entrega Final
            </span>
            <h2 className="text-2xl font-bold">
              Historias de Usuario y Matriz de Criterios de Aceptación (CA)
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Evaluación funcional del prototipo <strong>ComuniApp</strong> aplicando el ciclo de vida del prototipado (Gual Ortí, 2016; Suárez, 2017) y arquitectura Orientada a Objetos en TypeScript.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 text-xs space-y-1.5 shrink-0">
            <div className="font-bold text-blue-200 uppercase tracking-wider">Resumen de Evaluación</div>
            <div>• Historias de Usuario: <strong>{USER_STORIES.length} implementadas</strong></div>
            <div>• Criterios Evaluados: <strong>{totalCriteria} criterios (CA)</strong></div>
            <div className="text-emerald-300 font-semibold">• Cumplen: {passedCriteria} / {totalCriteria}</div>
            <div className="text-amber-300 font-semibold">
              • En Backlog (No cumple): {totalCriteria - passedCriteria} (Documentado)
            </div>
          </div>
        </div>
      </div>

      {/* Evidencia de Programación Orientada a Objetos (POO) y Ciclo de Vida */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800">
            Arquitectura Orientada a Objetos (POO) y Ciclo de Vida del Prototipo
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="font-bold text-indigo-700 mb-1">1. Abstracción y Herencia</div>
            <p className="text-slate-600">
              Clase abstracta <code className="font-mono font-bold">EntidadComunitaria</code> de la cual heredan <code className="font-mono font-bold">UsuarioComunitario</code> y <code className="font-mono font-bold">ModeloServicio</code> (<code className="font-mono">src/models/DomainModels.ts</code>).
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="font-bold text-indigo-700 mb-1">2. Encapsulamiento</div>
            <p className="text-slate-600">
              Atributos privados (<code className="font-mono">private passwordHash</code>, <code className="font-mono">private email</code>) protegidos mediante métodos de validación como <code className="font-mono">validarCredenciales()</code>.
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="font-bold text-indigo-700 mb-1">3. Polimorfismo</div>
            <p className="text-slate-600">
              Sobreescritura del método <code className="font-mono">override obtenerResumen()</code> adaptado según el tipo de entidad instanciada en tiempo de ejecución.
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="font-bold text-indigo-700 mb-1">4. Evaluación y Refinamiento</div>
            <p className="text-slate-600">
              Verificación empírica de cada criterio de aceptación (<code className="font-mono">CA-01.1</code> a <code className="font-mono">CA-06.1</code>) con registro de hallazgos para el backlog.
            </p>
          </div>
        </div>
      </section>

      {/* Desglose por cada Historia de Usuario con su Tabla de Criterios de Aceptación */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800">
            Matrices de Evaluación por Historia de Usuario y Criterios de Aceptación (CA)
          </h3>
        </div>

        {USER_STORIES.map((hu) => (
          <div key={hu.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-extrabold rounded-lg">
                  {hu.code}
                </span>
                <div>
                  <span className="text-[11px] font-bold uppercase text-indigo-600 block">
                    {hu.moduleName}
                  </span>
                  <h4 className="font-bold text-slate-900 text-base">{hu.title}</h4>
                </div>
              </div>
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-3 py-1 rounded-full self-start sm:self-center">
                Prioridad: {hu.priority}
              </span>
            </div>

            {/* Descripción formal de la Historia de Usuario */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase block mb-0.5">Actor / Rol (COMO):</span>
                <span className="text-slate-800 font-semibold">{hu.actor}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase block mb-0.5">Acción (QUIERO):</span>
                <span className="text-slate-800">{hu.want}</span>
              </div>
              <div>
                <span className="font-bold text-slate-500 uppercase block mb-0.5">Beneficio (PARA):</span>
                <span className="text-slate-800">{hu.soThat}</span>
              </div>
            </div>

            {/* Tabla de Criterios de Aceptación de la Historia */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase">
                    <th className="py-2.5 px-3 w-24">Código CA</th>
                    <th className="py-2.5 px-3 w-48">Criterio de Aceptación</th>
                    <th className="py-2.5 px-3">Escenario (Dado / Cuando / Entonces)</th>
                    <th className="py-2.5 px-3 w-48">Resultado Esperado</th>
                    <th className="py-2.5 px-3 w-28 text-center">Estado</th>
                    <th className="py-2.5 px-3 w-56">Observación / Refinamiento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {hu.criteria.map((ca) => (
                    <tr key={ca.code} className="hover:bg-slate-50/80">
                      <td className="py-3 px-3 font-mono font-bold text-indigo-700">{ca.code}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{ca.title}</td>
                      <td className="py-3 px-3 text-slate-600 leading-relaxed">{ca.gherkin}</td>
                      <td className="py-3 px-3 text-slate-700">{ca.expectedResult}</td>
                      <td className="py-3 px-3 text-center">
                        {ca.status === 'Cumple' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Cumple
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            <XCircle className="w-3.5 h-3.5" /> No cumple
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-600 italic">{ca.observation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

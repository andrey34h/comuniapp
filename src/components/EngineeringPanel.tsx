import React, { useState } from 'react';
import { USER_STORIES, EVALUATION_CRITERIA } from '../data/projectData';
import { CheckCircle2, GitBranch, Layers, ClipboardCheck, BookOpen, Award } from 'lucide-react';

export const EngineeringPanel: React.FC = () => {
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({
    'ev-1': true,
    'ev-2': true,
    'ev-3': true,
    'ev-4': true,
    'ev-5': true,
  });

  const toggleCriterion = (id: string) => {
    setCheckedCriteria((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const lifecycleSteps = [
    {
      step: '1. Recolección de Requisitos',
      desc: 'Definición del MVP de ComuniApp, identificación de actores (Residentes y Emprendedores) y especificación de 5 Historias de Usuario.',
      ref: 'Suárez (2017)'
    },
    {
      step: '2. Diseño Rápido',
      desc: 'Modelado de interfaces en TypeScript, arquitectura basada en componentes y traducción del UI Kit de Figma (Actividad 2).',
      ref: 'Gual Ortí (2016)'
    },
    {
      step: '3. Construcción del Prototipo',
      desc: 'Codificación funcional en React + TypeScript con estado reactivo, filtrado en tiempo real y persistencia en navegador.',
      ref: 'Prototipo Evolutivo'
    },
    {
      step: '4. Evaluación del Prototipo',
      desc: 'Validación contra criterios de aceptación Gherkin, pruebas de rendimiento (< 3s) y verificación de usabilidad.',
      ref: 'Métricas QA'
    },
    {
      step: '5. Refinamiento y Entrega',
      desc: 'Ajuste de retroalimentación visual, control de versiones con commits semánticos en GitHub y documentación técnica.',
      ref: 'Release v1.0.0'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-3">
              <Award className="w-3.5 h-3.5" /> Ingeniería de Software • Actividad 4
            </span>
            <h2 className="text-2xl font-bold">Ficha Técnica y Ciclo de Vida del Prototipo Funcional</h2>
            <p className="text-slate-300 text-sm mt-1 max-w-3xl">
              Evidencia de ingeniería de software aplicada al proyecto <strong>ComuniApp</strong>: trazabilidad desde la recolección de requisitos hasta la evaluación y refinamiento del prototipo funcional en TypeScript.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 text-xs space-y-1 shrink-0">
            <div className="font-semibold text-blue-200">Stack Tecnológico</div>
            <div>• Lenguaje: TypeScript 5.6 (Strict Mode)</div>
            <div>• Frontend: React 18 + Tailwind CSS</div>
            <div>• Empaquetador: Vite 5</div>
            <div>• Tipo: Prototipo Funcional Evolutivo</div>
          </div>
        </div>
      </div>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800">
            1. Aplicación del Ciclo de Vida del Prototipo (Gual Ortí, 2016; Suárez, 2017)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {lifecycleSteps.map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                  Fase {idx + 1}
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-2">{item.step}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-200/80 text-[11px] font-medium text-slate-500 flex items-center justify-between">
                <span>Ref: {item.ref}</span>
                <span className="text-emerald-600 font-semibold">● Completado</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-800">
              2. Historias de Usuario y Criterios de Aceptación Implementados
            </h3>
          </div>
          <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
            5 / 5 Historias Operativas
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {USER_STORIES.map((hu) => (
            <div key={hu.id} className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <span className="px-2.5 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-md">
                  {hu.code}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-slate-500">{hu.priority}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {hu.status}
                  </span>
                </div>
              </div>
              <h4 className="font-bold text-slate-900 mb-2">{hu.title}</h4>
              <div className="text-xs bg-white p-3 rounded-lg border border-slate-200 text-slate-700 space-y-1 mb-3">
                <p><strong>COMO:</strong> {hu.role}</p>
                <p><strong>QUIERO:</strong> {hu.want}</p>
                <p><strong>PARA:</strong> {hu.soThat}</p>
              </div>
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  Criterios de Aceptación (Gherkin):
                </div>
                {hu.acceptanceCriteria.map((crit, i) => (
                  <div key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">✓</span>
                    <span>{crit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-800">
              3. Matriz de Criterios de Evaluación y Refinamiento del Prototipo
            </h3>
          </div>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5" /> Rama: <code className="font-mono font-bold text-slate-700">main</code>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100 text-slate-700 text-xs uppercase">
                <th className="py-3 px-4">Fase del Ciclo</th>
                <th className="py-3 px-4">Criterio / Métrica de Evaluación</th>
                <th className="py-3 px-4">Meta Esperada</th>
                <th className="py-3 px-4">Resultado en Prototipo</th>
                <th className="py-3 px-4 text-center">Verificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {EVALUATION_CRITERIA.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-semibold text-indigo-700">{item.phase}</td>
                  <td className="py-3 px-4 font-medium text-slate-900">{item.metric}</td>
                  <td className="py-3 px-4 text-slate-600">{item.target}</td>
                  <td className="py-3 px-4 text-emerald-700 font-medium">{item.result}</td>
                  <td className="py-3 px-4 text-center">
                    <input
                      type="checkbox"
                      checked={!!checkedCriteria[item.id]}
                      onChange={() => toggleCriterion(item.id)}
                      className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

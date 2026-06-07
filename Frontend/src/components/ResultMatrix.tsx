import React from 'react';

interface ResultData {
  availability?: number;
  nominalLatency?: number;
  p95Latency?: number;
  cpuUsage?: number;
  mttr?: number;
}

interface ResultMatrixProps {
  results: ResultData | null;
  testType: 'nominal' | 'stress' | 'chaos';
}

const ResultMatrix: React.FC<ResultMatrixProps> = ({ results, testType }) => {
  if (!results) return null;

  const allMetrics = [
    { id: 'availability', name: 'Disponibilidad', value: results.availability, threshold: '≥ 99.9%', unit: '%', isPass: (results.availability || 0) >= 99.9 },
    { id: 'nominalLatency', name: 'Latencia Nominal', value: results.nominalLatency, threshold: '≤ 2000 ms', unit: 'ms', isPass: (results.nominalLatency || 0) <= 2000 },
    { id: 'p95Latency', name: 'Latencia p95 (Estrés)', value: results.p95Latency, threshold: '≤ 3000 ms', unit: 'ms', isPass: (results.p95Latency || 0) <= 3000 },
    { id: 'cpuUsage', name: 'Uso CPU Edge', value: results.cpuUsage, threshold: '< 80%', unit: '%', isPass: (results.cpuUsage || 100) < 80 },
    { id: 'mttr', name: 'MTTR', value: results.mttr, threshold: '≤ 300 s', unit: 's', isPass: (results.mttr || 999) <= 300 },
  ];

  let visibleMetrics: typeof allMetrics = [];
  if (testType === 'nominal') {
    visibleMetrics = allMetrics.filter(m => m.id === 'availability' || m.id === 'nominalLatency' || m.id === 'cpuUsage');
  } else if (testType === 'stress') {
    visibleMetrics = allMetrics.filter(m => m.id === 'availability' || m.id === 'p95Latency' || m.id === 'cpuUsage');
  } else if (testType === 'chaos') {
    visibleMetrics = allMetrics.filter(m => m.id === 'availability' || m.id === 'mttr');
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mt-6 transition-colors">
      <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Matriz de Resultados ISO/IEC 25040
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Comparativa automática de las métricas obtenidas en esta prueba específica contra los umbrales de referencia.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm uppercase tracking-wider">
              <th className="py-3 px-4 font-semibold">Métrica</th>
              <th className="py-3 px-4 font-semibold">Valor Obtenido</th>
              <th className="py-3 px-4 font-semibold">Umbral ISO</th>
              <th className="py-3 px-4 font-semibold text-center">Evaluación</th>
            </tr>
          </thead>
          <tbody>
            {visibleMetrics.map((metric, index) => (
              <tr key={index} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-750/50 transition-colors">
                <td className="py-4 px-4 text-slate-700 dark:text-slate-200 font-medium">{metric.name}</td>
                <td className="py-4 px-4 font-mono text-slate-600 dark:text-slate-300">
                  {metric.value !== undefined ? metric.value.toFixed(2) : '--'} {metric.unit}
                </td>
                <td className="py-4 px-4 font-mono text-slate-500 dark:text-slate-400">{metric.threshold}</td>
                <td className="py-4 px-4 text-center">
                  {metric.value !== undefined ? (
                    metric.isPass ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                        Cumple
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                        No Cumple
                      </span>
                    )
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultMatrix;

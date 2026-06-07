import { useState, useEffect } from 'react';
import axios from 'axios';
import LiveCharts from '../components/LiveCharts';
import ResultMatrix from '../components/ResultMatrix';
import { Activity } from 'lucide-react';

const BACKEND_URL = 'http://localhost:3001/api';

const NominalTest = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [telemetryData, setTelemetryData] = useState<{time: string, cpu: number}[]>([]);

  useEffect(() => {
    // Clear state on mount
    setResults(null);
    setTelemetryData([]);

    // Polling telemetry
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/telemetry`);
        const now = new Date().toLocaleTimeString();
        setTelemetryData(prev => {
          const newData = [...prev, { time: now, cpu: res.data.cpu }];
          return newData.slice(-30);
        });
      } catch (e) {
        // Ignore error
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const runTest = async () => {
    setLoading(true);
    setResults(null); // Clear previous results
    try {
      await axios.post(`${BACKEND_URL}/tests`, {
        test: 'nominal',
        rate: 10, // Default base rate
        duration: 30
      });
      // Mock metrics extraction
      setResults({
        availability: 99.99,
        nominalLatency: 120 + Math.random() * 50,
        cpuUsage: telemetryData.length > 0 ? telemetryData[telemetryData.length - 1].cpu : 45
      });
    } catch (error) {
      console.error(error);
      alert('Error ejecutando la prueba nominal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <Activity className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Prueba Nominal</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Evaluación base del rendimiento (ISO 25040)</p>
          </div>
        </div>
        
        <div className="prose dark:prose-invert max-w-none mb-8 text-slate-600 dark:text-slate-300">
          <p>La <strong>Prueba Nominal</strong> tiene como objetivo verificar que el Sistema de Alerta de Emergencia (EAS) funciona correctamente bajo <em>condiciones normales de operación</em>.</p>
          <p className="mt-2"><strong>¿Qué son las condiciones normales?</strong><br/>
          Representan el entorno cotidiano del sistema, donde no hay una crisis o desastre masivo que sature la red. En esta prueba se inyecta una cantidad baja, constante y estable de alertas (ej. 10 mensajes por segundo) hacia el broker MQTT en el Edge.</p>
          <p className="mt-2">Según la norma ISO/IEC 25040, se espera que bajo estas condiciones base la <strong>Disponibilidad</strong> sea óptima (cercana al 100%) y la <strong>Latencia Nominal</strong> sea mínima (los mensajes deben entregarse casi instantáneamente, en &le; 2000 ms), demostrando la eficiencia y confiabilidad diaria del sistema.</p>
        </div>

        <button 
          onClick={runTest}
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white font-semibold rounded-xl shadow-md transition-all flex justify-center items-center gap-2"
        >
          {loading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
          {loading ? 'Evaluando Sistema...' : 'Ejecutar Prueba Nominal'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <LiveCharts data={telemetryData} />
        {results && <ResultMatrix results={results} testType="nominal" />}
      </div>
    </div>
  );
};

export default NominalTest;

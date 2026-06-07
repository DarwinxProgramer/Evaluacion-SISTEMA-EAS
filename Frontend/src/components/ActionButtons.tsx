import React, { useState } from 'react';
import axios from 'axios';

interface ActionButtonsProps {
  rate: number;
  duration: number;
  onTestStart: (testType: string) => void;
  onTestComplete: (result: any) => void;
}

const BACKEND_URL = 'http://localhost:3001/api';

const ActionButtons: React.FC<ActionButtonsProps> = ({ rate, duration, onTestStart, onTestComplete }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const runTest = async (testType: string) => {
    setLoading(testType);
    onTestStart(testType);
    try {
      const response = await axios.post(`${BACKEND_URL}/tests`, {
        test: testType,
        rate,
        duration
      });
      onTestComplete({ type: testType, success: true, data: response.data });
    } catch (error) {
      console.error(error);
      onTestComplete({ type: testType, success: false, error });
    } finally {
      setLoading(null);
    }
  };

  const runChaos = async (action: string) => {
    setLoading(`chaos-${action}`);
    try {
      await axios.post(`${BACKEND_URL}/chaos`, {
        action,
        target: 'homeassistant'
      });
      alert(`Chaos action '${action}' executed successfully.`);
    } catch (error) {
      console.error(error);
      alert(`Failed to execute chaos action: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700 mt-6">
      <h2 className="text-xl font-semibold mb-2 text-slate-100 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Controles de Evaluación
      </h2>
      <p className="text-sm text-slate-400 mb-6">Lanza diferentes escenarios de evaluación. Advertencia: Inyectar un fallo detendrá temporalmente el nodo para medir su recuperación (MTTR).</p>
      <div className="flex flex-wrap gap-4">
        <button 
          onClick={() => runTest('nominal')}
          disabled={loading !== null}
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'nominal' ? 'Ejecutando...' : 'Iniciar Prueba Nominal'}
        </button>
        <button 
          onClick={() => runTest('stress')}
          disabled={loading !== null}
          className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'stress' ? 'Ejecutando...' : 'Iniciar Prueba de Estrés'}
        </button>
        <button 
          onClick={() => runChaos('stop')}
          disabled={loading !== null}
          className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'chaos-stop' ? 'Ejecutando...' : 'Inyectar Fallo (MTTR)'}
        </button>
        <button 
          onClick={() => runChaos('start')}
          disabled={loading !== null}
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading === 'chaos-start' ? 'Ejecutando...' : 'Recuperar Nodo'}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;

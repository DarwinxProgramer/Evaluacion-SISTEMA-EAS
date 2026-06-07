import React, { useState } from 'react';
import axios from 'axios';
import ResultMatrix from '../components/ResultMatrix';
import { AlertTriangle, Power, PowerOff, CheckCircle } from 'lucide-react';

const BACKEND_URL = 'http://localhost:3001/api';

const ChaosTest = () => {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [nodeStatus, setNodeStatus] = useState<'running' | 'stopped'>('running');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [notification, setNotification] = useState<{msg: string, type: 'success'|'error'} | null>(null);

  // Clear results on mount inherently because state is isolated
  
  const showNotification = (msg: string, type: 'success' | 'error') => {
    setNotification({msg, type});
    setTimeout(() => setNotification(null), 5000);
  };

  const stopNode = async () => {
    setLoading('stop');
    setResults(null);
    try {
      await axios.post(`${BACKEND_URL}/chaos`, { action: 'stop', target: 'homeassistant' });
      setNodeStatus('stopped');
      setStartTime(Date.now()); // Record exact time of failure
      showNotification('Fallo Inyectado: Contenedor Home Assistant detenido abruptamente.', 'error');
    } catch (error) {
      console.error(error);
      showNotification('Error al inyectar fallo. Revisa la conexión al socket de Docker.', 'error');
    } finally {
      setLoading(null);
    }
  };

  const recoverNode = async () => {
    if (!startTime) return;
    setLoading('recover');
    try {
      await axios.post(`${BACKEND_URL}/chaos`, { action: 'start', target: 'homeassistant' });
      const endTime = Date.now();
      const mttrSeconds = (endTime - startTime) / 1000;
      
      setNodeStatus('running');
      setStartTime(null);
      showNotification('Nodo Recuperado: Contenedor Home Assistant reiniciado exitosamente.', 'success');
      
      // Compute Chaos results and log them to backend
      const chaosResults = {
        availability: mttrSeconds > 120 ? 99.5 : 99.9, // Penalty for slow recovery
        mttr: mttrSeconds
      };
      setResults(chaosResults);

      await axios.post(`${BACKEND_URL}/chaos`, { action: 'log', target: 'homeassistant', mttr: mttrSeconds });
      
    } catch (error) {
      console.error(error);
      showNotification('Error al recuperar el nodo. Acción manual requerida.', 'error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Ingeniería del Caos (MTTR)</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Evaluación de Tolerancia a Fallos y Madurez (ISO 25040)</p>
          </div>
        </div>
        
        <div className="prose dark:prose-invert max-w-none mb-8 text-slate-600 dark:text-slate-300">
          <p>La <strong>Prueba de Caos</strong> desactiva intencionalmente componentes vitales (en este caso, el contenedor Edge de Home Assistant) para medir el Tiempo Medio de Recuperación (MTTR). Es fundamental para sistemas de alerta donde la alta disponibilidad salva vidas.</p>
        </div>

        {notification && (
          <div className={`mb-6 p-4 border-l-4 rounded-r-lg flex items-center gap-3 ${
            notification.type === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400' 
            : 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400'
          }`}>
            {notification.type === 'error' ? <AlertTriangle className="w-5 h-5 flex-shrink-0" /> : <CheckCircle className="w-5 h-5 flex-shrink-0" />}
            <p className="font-medium">{notification.msg}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button 
            onClick={stopNode}
            disabled={loading !== null || nodeStatus === 'stopped'}
            className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-400 dark:disabled:bg-red-900/50 text-white font-bold rounded-xl shadow-md transition-all flex flex-col justify-center items-center gap-2 border-b-4 border-red-800 active:border-b-0 active:translate-y-1 disabled:border-b-0 disabled:translate-y-1"
          >
            {loading === 'stop' ? <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <PowerOff className="w-8 h-8 mb-1" />}
            Inyectar Fallo (Caída del Nodo)
          </button>
          
          <button 
            onClick={recoverNode}
            disabled={loading !== null || nodeStatus === 'running'}
            className="flex-1 px-6 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 dark:disabled:bg-emerald-900/50 text-white font-bold rounded-xl shadow-md transition-all flex flex-col justify-center items-center gap-2 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 disabled:border-b-0 disabled:translate-y-1"
          >
            {loading === 'recover' ? <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <Power className="w-8 h-8 mb-1" />}
            Restaurar y Calcular MTTR
          </button>
        </div>
      </div>

      {results && <ResultMatrix results={results} testType="chaos" />}
    </div>
  );
};

export default ChaosTest;

import { Link } from 'react-router-dom';
import { Activity, Zap, AlertTriangle } from 'lucide-react';

const Home = () => {
  const cards = [
    {
      title: 'Prueba Nominal',
      path: '/nominal',
      icon: <Activity className="w-8 h-8 text-blue-500" />,
      description: 'Evalúa el funcionamiento base del sistema bajo condiciones normales, sin carga excesiva ni fallos.',
      iso: 'Se evalúa la Disponibilidad general y la Latencia Nominal (< 2000 ms).'
    },
    {
      title: 'Prueba de Estrés',
      path: '/stress',
      icon: <Zap className="w-8 h-8 text-purple-500" />,
      description: 'Inyecta un volumen masivo de mensajes concurrentes para medir la degradación del rendimiento.',
      iso: 'Enfocado en Comportamiento Temporal, midiendo Latencia p95 (< 3000 ms) y Consumo de Recursos.'
    },
    {
      title: 'Chaos Engineering',
      path: '/chaos',
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      description: 'Simula la caída abrupta de un nodo Edge para evaluar la capacidad de recuperación del sistema.',
      iso: 'Mide la Madurez y Tolerancia a Fallos calculando el MTTR (Tiempo Medio de Recuperación).'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
          Laboratorio de Simulación Edge+
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Selecciona un escenario de prueba para comenzar a evaluar el sistema bajo los lineamientos de la norma ISO/IEC 25040.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {cards.map((card, index) => (
          <Link 
            key={index}
            to={card.path}
            className="group flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
              {card.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {card.title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 flex-grow">
              {card.description}
            </p>
            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                <strong className="text-slate-700 dark:text-slate-300">ISO 25040:</strong> {card.iso}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import NominalTest from './pages/NominalTest';
import StressTest from './pages/StressTest';
import ChaosTest from './pages/ChaosTest';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="nominal" element={<NominalTest />} />
            <Route path="stress" element={<StressTest />} />
            <Route path="chaos" element={<ChaosTest />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

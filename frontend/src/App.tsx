import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Overview from './pages/Overview';
import DataExplorer from './pages/DataExplorer';
import AlgorithmLab from './pages/AlgorithmLab';
import NetworkAnalysis from './pages/NetworkAnalysis';
import Benchmarking from './pages/Benchmarking';
import ExecutionHistory from './pages/ExecutionHistory';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<Overview />} />
          <Route path="data-explorer" element={<DataExplorer />} />
          <Route path="algorithm-lab" element={<AlgorithmLab />} />
          <Route path="network-analysis" element={<NetworkAnalysis />} />
          <Route path="benchmarking" element={<Benchmarking />} />
          <Route path="history" element={<ExecutionHistory />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

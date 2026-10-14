import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-[#0a0f1e] text-slate-200 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6 bg-[#0a0f1e]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

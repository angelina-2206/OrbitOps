import React from 'react';
import { DashboardLayout } from './components/Layout/DashboardLayout';
import { Toaster } from 'sonner';

export const App: React.FC = () => {
  return (
    <>
      <DashboardLayout />
      <Toaster 
        theme="dark" 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#111827',
            color: '#F8FAFC',
            border: '1px solid #1F2937',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
    </>
  );
};

export default App;

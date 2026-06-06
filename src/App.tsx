import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { SubmitUrlSection } from './components/SubmitUrlSection';
import { DashboardSection } from './components/DashboardSection';
import { LoginSection } from './components/LoginSection';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'submit' | 'dashboard'>('submit');

  if (!isAuthenticated) {
    return <LoginSection onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setIsAuthenticated(false)}>
      {activeTab === 'submit' ? (
        <div className="max-w-2xl mx-auto py-8">
          <SubmitUrlSection onSubmitted={() => setTimeout(() => setActiveTab('dashboard'), 1500)} />
        </div>
      ) : (
        <div className="py-4">
          <DashboardSection />
        </div>
      )}
    </Layout>
  );
}


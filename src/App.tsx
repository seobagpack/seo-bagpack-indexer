import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { SubmitUrlSection } from './components/SubmitUrlSection';
import { DashboardSection } from './components/DashboardSection';

export default function App() {
  const [activeTab, setActiveTab] = useState<'submit' | 'dashboard'>('submit');

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
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

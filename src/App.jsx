import React from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { CertificateModal } from './components/CertificateModal';
import { ProjectModal } from './components/ProjectModal';
import { PortfolioPage } from './pages/PortfolioPage';
import { AdminPage } from './pages/AdminPage';

const AppContent = () => {
  const { currentView } = usePortfolio();

  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-stone-800 font-sans selection:bg-amber-200 selection:text-amber-900">
      <Navbar />
      <main className="flex-1">
        {currentView === 'admin' ? <AdminPage /> : <PortfolioPage />}
      </main>
      <Footer />
      <CertificateModal />
      <ProjectModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}

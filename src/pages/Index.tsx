import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AuthPage } from '@/components/AuthPage';
import { Sidebar } from '@/components/Sidebar';
import { CatalogPage } from '@/components/CatalogPage';
import { AddReleasePage } from '@/components/AddReleasePage';
import { AnalyticsPage } from '@/components/AnalyticsPage';
import { ProfilePage } from '@/components/ProfilePage';

type Page = 'catalog' | 'add-release' | 'analytics' | 'profile';

const MainApp = () => {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState<Page>('catalog');

  if (!currentUser) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        {currentPage === 'catalog' && <CatalogPage />}
        {currentPage === 'add-release' && <AddReleasePage />}
        {currentPage === 'analytics' && <AnalyticsPage />}
        {currentPage === 'profile' && <ProfilePage />}
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
};

export default Index;

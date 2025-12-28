import React, { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AuthPage } from '@/components/AuthPage';
import { Sidebar } from '@/components/Sidebar';
import { CatalogPage } from '@/components/CatalogPage';
import { AddReleasePage } from '@/components/AddReleasePage';
import { AnalyticsPage } from '@/components/AnalyticsPage';
import { ProfilePage } from '@/components/ProfilePage';
import { DraftsPage } from '@/components/DraftsPage';
import { SupportPage } from '@/components/SupportPage';
import { Release } from '@/types';

type Page = 'catalog' | 'add-release' | 'analytics' | 'profile' | 'drafts' | 'support';

const MainApp = () => {
  const { currentUser } = useApp();
  const [currentPage, setCurrentPage] = useState<Page>('catalog');
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);

  if (!currentUser) {
    return <AuthPage />;
  }

  const handleEdit = (release: Release) => {
    setEditingRelease(release);
    setCurrentPage('add-release');
  };

  const handleSaveRelease = () => {
    setEditingRelease(null);
    setCurrentPage('catalog');
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={(page) => {
        setCurrentPage(page);
        if (page !== 'add-release') {
          setEditingRelease(null);
        }
      }} />
      <main className="flex-1 overflow-y-auto">
        {currentPage === 'catalog' && <CatalogPage onEdit={handleEdit} />}
        {currentPage === 'drafts' && <DraftsPage onEdit={handleEdit} />}
        {currentPage === 'add-release' && <AddReleasePage editingRelease={editingRelease} onSave={handleSaveRelease} />}
        {currentPage === 'analytics' && <AnalyticsPage />}
        {currentPage === 'support' && <SupportPage />}
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
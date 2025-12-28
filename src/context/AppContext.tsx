import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Release, AppContextType } from '@/types';

const AppContext = createContext<AppContextType | undefined>(undefined);

const ADMIN_USER: User = {
  id: 'admin-001',
  email: 'moder@olprod.ru',
  password: 'zzzz-2014',
  name: 'Модератор',
  isAdmin: true,
  createdAt: new Date().toISOString(),
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([ADMIN_USER]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedUsers = localStorage.getItem('kedoo_users');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      const hasAdmin = parsedUsers.some((u: User) => u.email === 'moder@olprod.ru');
      setUsers(hasAdmin ? parsedUsers : [ADMIN_USER, ...parsedUsers]);
    }

    const savedReleases = localStorage.getItem('kedoo_releases');
    if (savedReleases) {
      setReleases(JSON.parse(savedReleases));
    }

    const savedTheme = localStorage.getItem('kedoo_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('kedoo_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('kedoo_releases', JSON.stringify(releases));
  }, [releases]);

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
    sendEmailNotification('new_user', user);
  };

  const addRelease = (release: Release) => {
    setReleases((prev) => [...prev, release]);
    sendEmailNotification('new_release', release);
  };

  const updateRelease = (id: string, updates: Partial<Release>) => {
    setReleases((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r))
    );
  };

  const deleteRelease = (id: string) => {
    setReleases((prev) => prev.filter((r) => r.id !== id));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('kedoo_theme', newTheme);
  };

  const sendEmailNotification = (type: string, data: any) => {
    console.log(`📧 Email notification to redkino843@gmail.com:`, { type, data });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        releases,
        addUser,
        addRelease,
        updateRelease,
        deleteRelease,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

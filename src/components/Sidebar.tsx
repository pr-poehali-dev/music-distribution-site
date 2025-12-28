import React from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

type Page = 'catalog' | 'add-release' | 'analytics' | 'profile' | 'drafts' | 'support';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { currentUser, setCurrentUser, theme, toggleTheme } = useApp();

  const menuItems = [
    { id: 'catalog' as Page, label: currentUser?.isAdmin ? 'Модерация' : 'Мои релизы', icon: 'Library' },
    { id: 'drafts' as Page, label: 'Черновики', icon: 'FileEdit', hidden: currentUser?.isAdmin },
    { id: 'add-release' as Page, label: 'Добавить релиз', icon: 'Plus', hidden: currentUser?.isAdmin },
    { id: 'analytics' as Page, label: 'Аналитика', icon: 'BarChart3' },
    { id: 'support' as Page, label: currentUser?.isAdmin ? 'Тикеты' : 'Поддержка', icon: 'MessageSquare' },
    { id: 'profile' as Page, label: 'Профиль', icon: 'User' },
  ];

  return (
    <div className="w-64 h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center shadow-md">
            <Icon name="Music" size={20} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            kedoo
          </h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => 
          !item.hidden && (
            <Button
              key={item.id}
              variant={currentPage === item.id ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start gap-3 h-11 text-base font-medium transition-all',
                currentPage === item.id && 'gradient-purple text-white shadow-md'
              )}
              onClick={() => onNavigate(item.id)}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </Button>
          )
        )}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-3 h-11"
          onClick={toggleTheme}
        >
          <Icon name={theme === 'light' ? 'Moon' : 'Sun'} size={20} />
          {theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => setCurrentUser(null)}
        >
          <Icon name="LogOut" size={20} />
          Выйти
        </Button>
      </div>
    </div>
  );
};
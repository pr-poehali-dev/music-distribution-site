import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

export const ProfilePage = () => {
  const { currentUser } = useApp();

  if (!currentUser) return null;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Личный кабинет</h1>
        <p className="text-muted-foreground text-lg">Ваша информация и настройки</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full gradient-purple flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-2xl">{currentUser.name}</CardTitle>
              <p className="text-muted-foreground">{currentUser.email}</p>
              {currentUser.isAdmin && (
                <Badge className="mt-2 bg-accent text-accent-foreground">
                  <Icon name="Shield" size={14} className="mr-1" />
                  Модератор
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Информация об аккаунте</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b">
              <div className="flex items-center gap-3">
                <Icon name="Mail" size={20} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Email</span>
              </div>
              <span className="font-medium">{currentUser.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <div className="flex items-center gap-3">
                <Icon name="Calendar" size={20} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Дата регистрации</span>
              </div>
              <span className="font-medium">{new Date(currentUser.createdAt).toLocaleDateString('ru-RU')}</span>
            </div>
            <div className="flex justify-between items-center py-3">
              <div className="flex items-center gap-3">
                <Icon name="User" size={20} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Роль</span>
              </div>
              <span className="font-medium">{currentUser.isAdmin ? 'Модератор' : 'Артист'}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icon name="Settings" size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Дополнительные настройки профиля будут доступны в следующей версии
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export const AnalyticsPage = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Аналитика</h1>
        <p className="text-muted-foreground text-lg">Следите за статистикой ваших релизов</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Всего прослушиваний</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">+0% за месяц</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Новых слушателей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">+0% за месяц</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Доход</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₽0</div>
            <p className="text-xs text-muted-foreground mt-1">+0% за месяц</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Релизов</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Активных</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 rounded-full gradient-purple flex items-center justify-center mb-6 shadow-xl">
            <Icon name="TrendingUp" size={40} className="text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Аналитика скоро появится</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Мы работаем над детальной аналитикой прослушиваний, географией аудитории и доходами.
            Следите за обновлениями!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

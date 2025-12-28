import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Ticket } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

export const SupportPage = () => {
  const { currentUser, tickets, addTicket, updateTicket } = useApp();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [response, setResponse] = useState('');

  const userTickets = currentUser?.isAdmin
    ? tickets
    : tickets.filter((t) => t.userId === currentUser?.id);

  const handleCreateTicket = () => {
    if (!currentUser || !subject.trim() || !message.trim()) {
      toast.error('Заполните все поля');
      return;
    }

    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      subject,
      message,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    addTicket(newTicket);
    setSubject('');
    setMessage('');
    toast.success('Тикет создан');
  };

  const handleRespond = () => {
    if (!selectedTicket || !response.trim()) {
      toast.error('Введите ответ');
      return;
    }

    updateTicket(selectedTicket.id, {
      response,
      status: 'answered',
      answeredAt: new Date().toISOString(),
    });

    setSelectedTicket(null);
    setResponse('');
    toast.success('Ответ отправлен');
  };

  const getStatusColor = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'bg-accent text-accent-foreground';
      case 'answered':
        return 'bg-green-500 text-white';
      case 'closed':
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'Открыт';
      case 'answered':
        return 'Отвечен';
      case 'closed':
        return 'Закрыт';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {currentUser?.isAdmin ? 'Тикеты поддержки' : 'Поддержка'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {currentUser?.isAdmin ? 'Управление обращениями пользователей' : 'Свяжитесь с нами'}
        </p>
      </div>

      {!currentUser?.isAdmin && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Создать тикет</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Тема</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Кратко опишите проблему"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Сообщение</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Подробно опишите вашу проблему или вопрос"
                className="min-h-[120px]"
              />
            </div>
            <Button onClick={handleCreateTicket} className="gradient-purple text-white">
              <Icon name="Send" size={18} className="mr-2" />
              Отправить тикет
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {userTickets.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Icon name="MessageSquare" size={64} className="text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">
                {currentUser?.isAdmin ? 'Нет тикетов' : 'У вас нет обращений'}
              </p>
            </CardContent>
          </Card>
        ) : (
          userTickets.map((ticket) => (
            <Card
              key={ticket.id}
              className="hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedTicket(ticket)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{ticket.subject}</CardTitle>
                      <Badge className={getStatusColor(ticket.status)}>
                        {getStatusLabel(ticket.status)}
                      </Badge>
                    </div>
                    {currentUser?.isAdmin && (
                      <p className="text-sm text-muted-foreground">
                        От: {ticket.userName}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(ticket.createdAt).toLocaleString('ru-RU')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">{ticket.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedTicket.subject}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="flex items-center gap-4 text-sm">
                <Badge className={getStatusColor(selectedTicket.status)}>
                  {getStatusLabel(selectedTicket.status)}
                </Badge>
                {currentUser?.isAdmin && (
                  <span className="text-muted-foreground">
                    От: {selectedTicket.userName}
                  </span>
                )}
                <span className="text-muted-foreground">
                  {new Date(selectedTicket.createdAt).toLocaleString('ru-RU')}
                </span>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Сообщение:</p>
                <p className="text-sm whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>

              {selectedTicket.response && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium mb-2">Ответ:</p>
                  <p className="text-sm whitespace-pre-wrap">{selectedTicket.response}</p>
                  {selectedTicket.answeredAt && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(selectedTicket.answeredAt).toLocaleString('ru-RU')}
                    </p>
                  )}
                </div>
              )}

              {currentUser?.isAdmin && selectedTicket.status === 'open' && (
                <div className="space-y-3 pt-4 border-t">
                  <Label htmlFor="response">Ваш ответ</Label>
                  <Textarea
                    id="response"
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Введите ответ пользователю"
                    className="min-h-[100px]"
                  />
                  <Button onClick={handleRespond} className="w-full gradient-purple text-white">
                    <Icon name="Send" size={18} className="mr-2" />
                    Отправить ответ
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

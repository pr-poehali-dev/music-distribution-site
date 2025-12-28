import React from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Release } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export const CatalogPage = () => {
  const { currentUser, releases, updateRelease } = useApp();
  const [selectedRelease, setSelectedRelease] = React.useState<Release | null>(null);
  const [rejectionReason, setRejectionReason] = React.useState('');
  const [showRejectDialog, setShowRejectDialog] = React.useState(false);

  const userReleases = currentUser?.isAdmin
    ? releases.filter((r) => r.status === 'moderation')
    : releases.filter((r) => r.userId === currentUser?.id);

  const getStatusColor = (status: Release['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-muted text-muted-foreground';
      case 'moderation':
        return 'bg-accent text-accent-foreground';
      case 'approved':
        return 'bg-green-500 text-white';
      case 'rejected':
        return 'bg-destructive text-destructive-foreground';
    }
  };

  const getStatusLabel = (status: Release['status']) => {
    switch (status) {
      case 'draft':
        return 'Черновик';
      case 'moderation':
        return 'На модерации';
      case 'approved':
        return 'Одобрен';
      case 'rejected':
        return 'Отклонён';
    }
  };

  const handleApprove = (release: Release) => {
    updateRelease(release.id, { status: 'approved' });
    setSelectedRelease(null);
    toast.success('Релиз одобрен!');
  };

  const handleReject = () => {
    if (selectedRelease && rejectionReason.trim()) {
      updateRelease(selectedRelease.id, { status: 'rejected', rejectionReason });
      setSelectedRelease(null);
      setShowRejectDialog(false);
      setRejectionReason('');
      toast.success('Релиз отклонён');
    }
  };

  const downloadFile = (url: string, filename: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    toast.success('Скачивание начато');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          {currentUser?.isAdmin ? 'Модерация релизов' : 'Каталог релизов'}
        </h1>
        <p className="text-muted-foreground text-lg">
          {currentUser?.isAdmin ? 'Проверяйте и одобряйте релизы' : 'Управляйте своими релизами'}
        </p>
      </div>

      {userReleases.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Icon name="Inbox" size={64} className="text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">
              {currentUser?.isAdmin ? 'Нет релизов на модерации' : 'У вас пока нет релизов'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userReleases.map((release) => (
            <Card key={release.id} className="overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedRelease(release)}>
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                {release.coverImage ? (
                  <img src={release.coverImage} alt={release.albumName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="Music" size={64} className="text-muted-foreground" />
                  </div>
                )}
                <Badge className={`absolute top-3 right-3 ${getStatusColor(release.status)}`}>
                  {getStatusLabel(release.status)}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{release.albumName}</CardTitle>
                <p className="text-sm text-muted-foreground">{release.artistName}</p>
                <p className="text-xs text-muted-foreground">{release.tracks.length} треков</p>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {selectedRelease && (
        <Dialog open={!!selectedRelease} onOpenChange={() => setSelectedRelease(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedRelease.albumName}</DialogTitle>
              <DialogDescription>{selectedRelease.artistName}</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {selectedRelease.coverImage && (
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img src={selectedRelease.coverImage} alt={selectedRelease.albumName} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Дата релиза</p>
                  <p className="font-medium">{new Date(selectedRelease.releaseDate).toLocaleDateString('ru-RU')}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Жанр</p>
                  <p className="font-medium">{selectedRelease.genre}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Статус</p>
                  <Badge className={getStatusColor(selectedRelease.status)}>{getStatusLabel(selectedRelease.status)}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Треков</p>
                  <p className="font-medium">{selectedRelease.tracks.length}</p>
                </div>
              </div>

              {selectedRelease.rejectionReason && (
                <div className="p-4 bg-destructive/10 rounded-lg">
                  <p className="text-sm font-medium text-destructive mb-1">Причина отклонения:</p>
                  <p className="text-sm">{selectedRelease.rejectionReason}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-3">Треклист</h3>
                <div className="space-y-2">
                  {selectedRelease.tracks.map((track, index) => (
                    <div key={track.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground font-mono">{String(index + 1).padStart(2, '0')}</span>
                        <span className="font-medium">{track.name}</span>
                      </div>
                      {currentUser?.isAdmin && track.fileUrl && (
                        <Button size="sm" variant="outline" onClick={() => downloadFile(track.fileUrl!, `${track.name}.mp3`)}>
                          <Icon name="Download" size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {currentUser?.isAdmin && selectedRelease.status === 'moderation' && (
                <div className="flex gap-3 pt-4 border-t">
                  {selectedRelease.coverImage && (
                    <Button variant="outline" onClick={() => downloadFile(selectedRelease.coverImage!, 'cover.jpg')} className="flex-1">
                      <Icon name="Download" size={18} className="mr-2" />
                      Скачать обложку
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setShowRejectDialog(true)} className="flex-1 text-destructive hover:text-destructive">
                    <Icon name="X" size={18} className="mr-2" />
                    Отклонить
                  </Button>
                  <Button onClick={() => handleApprove(selectedRelease)} className="flex-1 gradient-purple text-white">
                    <Icon name="Check" size={18} className="mr-2" />
                    Одобрить
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Отклонить релиз</DialogTitle>
            <DialogDescription>Укажите причину отклонения</DialogDescription>
          </DialogHeader>
          <Textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Например: Низкое качество обложки"
            className="min-h-[100px]"
          />
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="flex-1">
              Отмена
            </Button>
            <Button onClick={handleReject} disabled={!rejectionReason.trim()} className="flex-1 bg-destructive text-destructive-foreground">
              Отклонить
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

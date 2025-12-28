import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Release } from '@/types';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface DraftsPageProps {
  onEdit: (release: Release) => void;
}

export const DraftsPage: React.FC<DraftsPageProps> = ({ onEdit }) => {
  const { currentUser, releases, deleteRelease, updateRelease } = useApp();
  const [deleteConfirm, setDeleteConfirm] = useState<Release | null>(null);

  const drafts = releases.filter((r) => r.userId === currentUser?.id && r.status === 'draft');

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteRelease(deleteConfirm.id);
      setDeleteConfirm(null);
      toast.success('Черновик удалён');
    }
  };

  const handleSendToModeration = (release: Release) => {
    updateRelease(release.id, { status: 'moderation' });
    toast.success('Релиз отправлен на модерацию!');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Черновики</h1>
        <p className="text-muted-foreground text-lg">Незавершённые релизы</p>
      </div>

      {drafts.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Icon name="FileEdit" size={64} className="text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">У вас нет черновиков</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((release) => (
            <Card key={release.id} className="overflow-hidden hover:shadow-lg transition-all group">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 relative">
                {release.coverImage ? (
                  <img src={release.coverImage} alt={release.albumName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="Music" size={64} className="text-muted-foreground" />
                  </div>
                )}
                <Badge className="absolute top-3 right-3 bg-muted text-muted-foreground">
                  Черновик
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{release.albumName || 'Без названия'}</CardTitle>
                <p className="text-sm text-muted-foreground">{release.artistName || 'Неизвестный артист'}</p>
                <p className="text-xs text-muted-foreground">{release.tracks.length} треков</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => onEdit(release)}
                  >
                    <Icon name="Edit" size={16} className="mr-2" />
                    Редактировать
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendToModeration(release)}
                    className="flex-1"
                  >
                    <Icon name="Send" size={16} className="mr-2" />
                    На модерацию
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteConfirm(release)}
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить черновик?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Черновик "{deleteConfirm?.albumName}" будет удалён навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Release, Track } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface AddReleasePageProps {
  editingRelease?: Release | null;
  onSave?: () => void;
}

export const AddReleasePage: React.FC<AddReleasePageProps> = ({ editingRelease, onSave }) => {
  const { currentUser, addRelease, updateRelease } = useApp();
  const [step, setStep] = useState(1);
  const [releaseId] = useState(editingRelease?.id || '');
  const [albumName, setAlbumName] = useState(editingRelease?.albumName || '');
  const [artistName, setArtistName] = useState(editingRelease?.artistName || '');
  const [releaseDate, setReleaseDate] = useState(editingRelease?.releaseDate || '');
  const [genre, setGenre] = useState(editingRelease?.genre || '');
  const [coverImage, setCoverImage] = useState<string | null>(editingRelease?.coverImage || null);
  const [tracks, setTracks] = useState<Track[]>(editingRelease?.tracks || []);
  const [showPreview, setShowPreview] = useState(false);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Файл слишком большой. Максимум 10 МБ');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImage(reader.result as string);
        toast.success('Обложка загружена');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTrack = () => {
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      name: '',
      file: null,
    };
    setTracks([...tracks, newTrack]);
  };

  const handleTrackChange = (id: string, name: string) => {
    setTracks(tracks.map((t) => (t.id === id ? { ...t, name } : t)));
  };

  const handleTrackFileUpload = (id: string, file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Аудиофайл слишком большой. Максимум 50 МБ');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setTracks(tracks.map((t) => (t.id === id ? { ...t, file, fileUrl: reader.result as string } : t)));
      toast.success('Трек загружен');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveTrack = (id: string) => {
    setTracks(tracks.filter((t) => t.id !== id));
  };

  const canProceedToStep2 = albumName && artistName && releaseDate && genre && coverImage;
  const canSubmit = canProceedToStep2 && tracks.length > 0 && tracks.every((t) => t.name && t.file);

  const handleSubmit = (submitToModeration: boolean) => {
    if (!currentUser) return;

    if (releaseId) {
      updateRelease(releaseId, {
        albumName,
        artistName,
        releaseDate,
        genre,
        coverImage,
        tracks,
        status: submitToModeration ? 'moderation' : 'draft',
      });
      toast.success(submitToModeration ? 'Релиз отправлен на модерацию!' : 'Черновик обновлён');
    } else {
      const newRelease: Release = {
        id: `release-${Date.now()}`,
        userId: currentUser.id,
        albumName,
        artistName,
        releaseDate,
        genre,
        coverImage,
        tracks,
        status: submitToModeration ? 'moderation' : 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addRelease(newRelease);
      toast.success(submitToModeration ? 'Релиз отправлен на модерацию!' : 'Релиз сохранён как черновик');
    }
    
    setShowPreview(false);
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{releaseId ? 'Редактировать релиз' : 'Добавить релиз'}</h1>
        <p className="text-muted-foreground text-lg">{releaseId ? 'Измените информацию о релизе' : 'Загрузите свою музыку в kedoo'}</p>
      </div>

      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'gradient-purple text-white' : 'bg-muted'}`}>
            1
          </div>
          <div className={`w-20 h-1 ${step >= 2 ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-muted'}`} />
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'gradient-purple text-white' : 'bg-muted'}`}>
            2
          </div>
        </div>
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Информация об альбоме</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="albumName">Название альбома *</Label>
              <Input id="albumName" value={albumName} onChange={(e) => setAlbumName(e.target.value)} placeholder="Мой новый альбом" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="artistName">Исполнитель *</Label>
              <Input id="artistName" value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="Имя артиста" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="releaseDate">Дата релиза *</Label>
              <Input id="releaseDate" type="date" value={releaseDate} onChange={(e) => setReleaseDate(e.target.value)} min="1900-01-01" max="2100-12-31" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="genre">Жанр *</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Выберите жанр" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pop">Pop</SelectItem>
                  <SelectItem value="Rock">Rock</SelectItem>
                  <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                  <SelectItem value="Rap">Rap</SelectItem>
                  <SelectItem value="Electronic">Electronic</SelectItem>
                  <SelectItem value="Dance">Dance</SelectItem>
                  <SelectItem value="House">House</SelectItem>
                  <SelectItem value="Techno">Techno</SelectItem>
                  <SelectItem value="Dubstep">Dubstep</SelectItem>
                  <SelectItem value="R&B">R&B</SelectItem>
                  <SelectItem value="Soul">Soul</SelectItem>
                  <SelectItem value="Jazz">Jazz</SelectItem>
                  <SelectItem value="Blues">Blues</SelectItem>
                  <SelectItem value="Country">Country</SelectItem>
                  <SelectItem value="Folk">Folk</SelectItem>
                  <SelectItem value="Classical">Classical</SelectItem>
                  <SelectItem value="Metal">Metal</SelectItem>
                  <SelectItem value="Punk">Punk</SelectItem>
                  <SelectItem value="Indie">Indie</SelectItem>
                  <SelectItem value="Alternative">Alternative</SelectItem>
                  <SelectItem value="Reggae">Reggae</SelectItem>
                  <SelectItem value="Latin">Latin</SelectItem>
                  <SelectItem value="World">World</SelectItem>
                  <SelectItem value="Ambient">Ambient</SelectItem>
                  <SelectItem value="Trap">Trap</SelectItem>
                  <SelectItem value="Drill">Drill</SelectItem>
                  <SelectItem value="K-Pop">K-Pop</SelectItem>
                  <SelectItem value="J-Pop">J-Pop</SelectItem>
                  <SelectItem value="Phonk">Phonk</SelectItem>
                  <SelectItem value="Другое">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Обложка альбома (3000×3000) *</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer" onClick={() => document.getElementById('cover-upload')?.click()}>
                {coverImage ? (
                  <img src={coverImage} alt="Cover" className="max-w-xs mx-auto rounded-lg shadow-lg" />
                ) : (
                  <div className="space-y-4">
                    <Icon name="Upload" size={48} className="mx-auto text-muted-foreground" />
                    <div>
                      <p className="font-medium">Нажмите для загрузки обложки</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG до 10 МБ</p>
                    </div>
                  </div>
                )}
                <input id="cover-upload" type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
              </div>
            </div>

            <Button onClick={() => setStep(2)} disabled={!canProceedToStep2} className="w-full gradient-purple text-white h-12 text-lg">
              Далее
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Треклист</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {tracks.map((track, index) => (
              <div key={track.id} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-muted-foreground">Трек {index + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveTrack(track.id)} className="text-destructive">
                    <Icon name="Trash2" size={18} />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Название трека</Label>
                  <Input value={track.name} onChange={(e) => handleTrackChange(track.id, e.target.value)} placeholder="Название трека" />
                </div>

                <div className="space-y-2">
                  <Label>Аудиофайл</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer" onClick={() => document.getElementById(`audio-${track.id}`)?.click()}>
                    {track.file ? (
                      <div className="flex items-center justify-center gap-2">
                        <Icon name="Music" size={20} className="text-primary" />
                        <span className="text-sm">{track.file.name}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Icon name="Upload" size={20} />
                        <span className="text-sm">Загрузить MP3/WAV</span>
                      </div>
                    )}
                    <input
                      id={`audio-${track.id}`}
                      type="file"
                      accept="audio/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleTrackFileUpload(track.id, file);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={handleAddTrack} variant="outline" className="w-full h-12">
              <Icon name="Plus" size={20} className="mr-2" />
              Добавить трек
            </Button>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Назад
              </Button>
              <Button onClick={() => setShowPreview(true)} disabled={!canSubmit} className="flex-1 gradient-purple text-white">
                Предпросмотр
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Предпросмотр релиза</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {coverImage && (
              <div className="aspect-square rounded-lg overflow-hidden">
                <img src={coverImage} alt={albumName} className="w-full h-full object-cover" />
              </div>
            )}

            <div>
              <h2 className="text-2xl font-bold">{albumName}</h2>
              <p className="text-lg text-muted-foreground">{artistName}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Дата релиза</p>
                <p className="font-medium">{new Date(releaseDate).toLocaleDateString('ru-RU')}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Жанр</p>
                <p className="font-medium">{genre}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Треклист ({tracks.length})</h3>
              <div className="space-y-2">
                {tracks.map((track, index) => (
                  <div key={track.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground font-mono">{String(index + 1).padStart(2, '0')}</span>
                    <span className="font-medium">{track.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => handleSubmit(false)} className="flex-1">
                Сохранить черновик
              </Button>
              <Button onClick={() => handleSubmit(true)} className="flex-1 gradient-purple text-white">
                <Icon name="Send" size={18} className="mr-2" />
                Отправить на модерацию
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
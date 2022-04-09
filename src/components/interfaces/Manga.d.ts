export interface MangaPublish {
  nombre: string;
  descripcion: string;
  thumb?: string;
}

export interface MangaProps {
  manga?: MangaResponse;
  onSubscribe?: () => void;
  onDesubscribe?: () => void;
  onEdit?: (data: MangaPublish) => void;
  onOpenChapter?: (id: number) => void;
  onDeleteChapter?: (id: number) => void;
  onDelete?: () => void;
  onNewChapter?: () => void;
  onPublish?: (data: MangaPublish) => void;
  editable?: boolean;
}

export interface ChapterResponse {
  id: number;
  nombre: string;
  imagenes: string[];
  fecha_creado: string;
  visto: boolean;
}

export interface MangaResponse {
  id: number;
  nombre: string;
  descripcion: string;
  thumb: string;
  usuario_id: number;
  es_autor: boolean;
  suscrito: boolean;
  capitulos: ChapterResponse[];
}

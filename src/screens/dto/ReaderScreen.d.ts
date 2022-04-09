export interface MangaReadResponse {
  capitulo_id: bigint;
  terminado?: boolean;
  activo?: boolean;
  fecha_visto?: boolean;
  pagina?: number;
  manga_sentido?: string;
  imagenes: string[];
}

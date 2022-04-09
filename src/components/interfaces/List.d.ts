import { MangaResponse } from '../../screens/dto/MangaScreen';

export interface ListProps {
  data: MangaResponse[];
  onSearch: (search: string) => void;
  onSelect?: (id: number) => void;
}

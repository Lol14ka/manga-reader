import { Asset } from 'expo-image-multiple-picker';

import { RootStackParamList } from '../../App';
import { Chapter } from '../components/Chapter';
import { ModalError } from '../components/ModalError';
import { ModalLoading } from '../components/ModalLoading';
import useFunction from '../hooks/useFunction';

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
type Props = NativeStackScreenProps<RootStackParamList, "newChapter">;

export const NewChapterScreen = ({ navigation, route }: Props) => {
  const [{ isLoading, error }, sendManga] = useFunction("manga_grabar");

  const manga_id = route.params.manga_id;

  async function uploadChapter(title: string, images: Asset[]) {
    const res = await sendManga({
      data: {
        id: manga_id,
        nuevos_capitulos: [
          {
            nombre: title,
            imagenes: images.map((i) => i.uri),
          },
        ],
      },
    });
    if (res !== undefined) navigation.push("manga", { id: manga_id });
  }

  return (
    <>
      {error && (
        <ModalError
          error={error}
          onGoBack={() => navigation.push("manga", { id: manga_id })}
        />
      )}
      {isLoading && <ModalLoading />}
      <Chapter onPublish={uploadChapter} />
    </>
  );
};

export default NewChapterScreen;

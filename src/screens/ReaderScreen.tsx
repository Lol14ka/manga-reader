import { useEffect, useState } from 'react';
import { BackHandler } from 'react-native';

import { RootStackParamList } from '../../App';
import { ModalError } from '../components/ModalError';
import { ModalLoading } from '../components/ModalLoading';
import { Direction, Reader, ReaderStatus } from '../components/Reader';
import useFunction from '../hooks/useFunction';
import { useInterval } from '../hooks/useInterval';
import useNavigationFocus from '../hooks/useNavigationFocus';
import { MangaReadResponse } from './dto/ReaderScreen';

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
type Props = NativeStackScreenProps<RootStackParamList, "reader">;

export const ReaderScreen = ({ navigation, route }: Props) => {
  const [{ isLoading, error, response }, sendManga] = useFunction("manga_leer");
  const [_, sendTrackManga] = useFunction("manga_leer");
  const [statusHistory, setStatusHistory] = useState<ReaderStatus[]>([]);

  const mangaResponse = response as MangaReadResponse;

  async function sendCancelled() {
    await sendManga({
      data: { capitulo_id: route.params.chapter_id, activo: false },
    });
    if (navigation.canGoBack()) navigation.goBack();
  }

  function handleBack() {
    sendCancelled();
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBack);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", handleBack);
  }, []);

  useNavigationFocus(() => {
    sendManga({
      data: { capitulo_id: route.params.chapter_id, activo: true },
    });
  });

  const direction = route.params.direction || mangaResponse?.manga_sentido;
  const page = route.params.page || mangaResponse?.pagina;

  function goToNextChapter() {}

  function sendStatus(status: ReaderStatus) {
    setStatusHistory([...statusHistory, status]);
  }

  useInterval(() => {
    if (statusHistory.length > 0) {
      const status = statusHistory.pop();
      sendTrackManga({
        data: {
          capitulo_id: route.params.chapter_id,
          pagina: status?.page,
          manga_sentido: status?.direction,
        },
      });
      setStatusHistory([]);
    }
  }, 1000);

  return (
    <>
      {error && (
        <ModalError
          error={error}
          onGoBack={() => {
            navigation.popToTop();
            navigation.navigate("search");
          }}
        />
      )}
      {isLoading && <ModalLoading />}
      {mangaResponse && (
        <Reader
          page={page}
          direction={direction as Direction}
          onChange={sendStatus}
          onFinish={goToNextChapter}
          images={mangaResponse.imagenes.map((d, i) => ({
            url: d,
            id: i.toString(),
          }))}
        />
      )}
    </>
  );
};

export default ReaderScreen;

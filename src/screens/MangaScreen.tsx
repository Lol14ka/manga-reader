import { useLinkTo } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { RootStackParamList } from '../../App';
import { MangaPublish } from '../components/interfaces/Manga';
import { Manga } from '../components/Manga';
import { ModalError } from '../components/ModalError';
import { ModalLoading } from '../components/ModalLoading';
import useFunction from '../hooks/useFunction';
import useNavigationFocus from '../hooks/useNavigationFocus';
import usePermissions from '../hooks/usePermissions';
import usePromise from '../hooks/usePromise';
import { isLogged } from '../utils/store';
import { MangaResponse } from './dto/MangaScreen';

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
type Props = NativeStackScreenProps<RootStackParamList, "manga">;

export const MangaScreen = ({ navigation, route }: Props) => {
  const linkTo = useLinkTo();
  const [manga, sendManga] = useFunction("manga_traer");
  const [mangaGrabar, sendMangaGrabar] = useFunction("manga_grabar");
  const [permissions, permissionsHandlers] = usePermissions();
  const [editable, setEditable] = useState(false);
  const [logged, setIsLogged] = useState<boolean>();

  const params = route.params as { id?: string };

  useNavigationFocus(() => {
    permissionsHandlers.sendPermissions();
  });

  usePromise(async () => {
    if (
      !params &&
      permissionsHandlers.hasPermission("publicar_manga") == false
    ) {
      const logged = await isLogged();
      if (logged && navigation.canGoBack()) navigation.goBack();
      else if (!logged) {
        const parent = navigation.getParent();
        if (parent) parent.navigate("login", { callbackUrl: "/home/manga" });
        else linkTo("/login");
      }
    }
  }, [permissions.success]);

  usePromise(async () => {
    if (logged == undefined) {
      setIsLogged(await isLogged());
    }
  }, [logged]);

  useEffect(() => {
    if (params && params.id) {
      sendManga({
        data: { id: params.id },
      });
    }
  }, [permissions.success]);

  const mangaResponse = manga.response as MangaResponse;

  useEffect(() => {
    if (mangaResponse && mangaResponse.es_autor) setEditable(true);
    else if (permissionsHandlers.hasPermission("administrar_manga")) {
      setEditable(true);
    }
  }, [permissions.success, manga.success]);

  const err = manga.error || permissions.error || mangaGrabar.error;

  async function create(publish: MangaPublish) {
    const data = await sendMangaGrabar({
      data: publish,
    });
    navigation.popToTop();
    navigation.navigate("manga", {
      id: (data as MangaResponse).id,
    });
  }

  async function update(id: number, publish: MangaPublish) {
    const data = await sendMangaGrabar({
      data: { id, ...publish },
    });
    navigation.popToTop();
    navigation.navigate("manga", {
      id: (data as MangaResponse).id,
    });
  }

  function newChapter() {
    navigation.push("newChapter", { manga_id: mangaResponse.id });
  }

  function deleteChapter(id: number) {
    Alert.alert(
      "Eliminar capitulo",
      "Estas seguro de eliminar este capitulo?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Borrar",
          onPress: async () => {
            const data = await sendMangaGrabar({
              data: { id: mangaResponse.id, capitulos_a_desactivar: [{ id }] },
            });
            navigation.popToTop();
            navigation.navigate("manga", {
              id: (data as MangaResponse).id,
            });
          },
          style: "default",
        },
      ]
    );
  }

  function desubscribe() {
    (async () => {
      const data = await sendMangaGrabar({
        data: { id: mangaResponse.id, suscribirse: false },
      });
      navigation.popToTop();
      navigation.navigate("manga", {
        id: (data as MangaResponse).id,
      });
    })();
  }

  function subscribe() {
    if (logged) {
      (async () => {
        const data = await sendMangaGrabar({
          data: { id: mangaResponse.id, suscribirse: true },
        });
        navigation.popToTop();
        navigation.navigate("manga", {
          id: (data as MangaResponse).id,
        });
      })();
    } else linkTo("/login");
  }

  function remove() {
    Alert.alert("Eliminar manga", "Estas seguro de eliminar este manga?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Borrar",
        onPress: async () => {
          await sendMangaGrabar({
            data: { id: mangaResponse.id, activo: false },
          });
          navigation.popToTop();
          navigation.navigate("search");
        },
        style: "default",
      },
    ]);
  }

  function openChapter(id: number) {
    navigation.push("reader", { chapter_id: id });
  }

  const showSubscribe = !logged || !mangaResponse?.suscrito;
  const showUnsubscribe = logged && mangaResponse && mangaResponse.suscrito;

  return (
    <>
      {err && (
        <ModalError
          error={err}
          onGoBack={() => {
            navigation.popToTop();
            navigation.navigate("search");
          }}
        />
      )}
      {(manga.isLoading || permissions.isLoading || mangaGrabar.isLoading) && (
        <ModalLoading />
      )}
      {mangaResponse && (
        <Manga
          manga={mangaResponse}
          editable={editable}
          onEdit={(data) => update(mangaResponse.id, data)}
          onNewChapter={editable ? newChapter : undefined}
          onDeleteChapter={editable ? deleteChapter : undefined}
          onSubscribe={showSubscribe ? subscribe : undefined}
          onDesubscribe={showUnsubscribe ? desubscribe : undefined}
          onDelete={editable ? remove : undefined}
          onOpenChapter={openChapter}
        />
      )}
      {!mangaResponse &&
        permissionsHandlers.hasPermission("publicar_manga") && (
          <Manga onPublish={create} />
        )}
    </>
  );
};

export default MangaScreen;

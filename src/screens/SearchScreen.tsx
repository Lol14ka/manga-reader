import { useLinkTo } from '@react-navigation/native';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';

import { RootStackParamList } from '../../App';
import { List } from '../components/List';
import { ModalError } from '../components/ModalError';
import { ModalLoading } from '../components/ModalLoading';
import useFunction from '../hooks/useFunction';
import { useInterval } from '../hooks/useInterval';
import useNavigationFocus from '../hooks/useNavigationFocus';
import usePermissions from '../hooks/usePermissions';
import usePromise from '../hooks/usePromise';
import { clearToken, isLogged } from '../utils/store';
import { MangaResponse } from './dto/MangaScreen';
import { SuscriptionResponse } from './dto/SearchScreen';

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
type Props = NativeStackScreenProps<RootStackParamList, "search">;

export const SearchScreen = ({ navigation, route }: Props) => {
  const [logged, setIsLogged] = useState(false);

  const linkTo = useLinkTo();

  const [{ isLoading, error, response }, sendManga] =
    useFunction("manga_traer");

  const [suscription, sendSuscription] = useFunction("suscripcion_traer");
  const [onlySuscription, setOnlySuscription] = useState(
    route.params?.only_subscription
  );
  const [onlyCreator, setOnlyCreator] = useState(route.params?.only_creator);

  const [input, setInput] = useState<string>();
  const [searchs, setSearchs] = useState<string[]>([]);

  const [isNavOpen, setIsNavOpen] = useState(false);

  const [_, { hasPermission, sendPermissions }] = usePermissions();

  useNavigationFocus(() => {
    sendSuscription();
    sendPermissions();
    sendSearch();
    setIsNavOpen(false);
  });

  useNavigationFocus(async () => {
    setIsLogged(await isLogged());
  });

  usePromise(async () => {
    const response = suscription.response as SuscriptionResponse;
    if (response?.capitulo_id) {
      navigation.push("reader", {
        chapter_id: response.capitulo_id,
        page: response.pagina,
        direction: response.manga_sentido,
      });
    }
  }, [suscription.success]);

  async function sendSearch() {
    await sendManga({
      data: {
        busqueda: input,
        solo_suscritos: onlySuscription,
        solo_es_creador: onlyCreator,
      },
    });
  }

  usePromise(async () => {
    if (input !== undefined) {
      sendSearch();
    }
  }, [input, onlyCreator, onlySuscription]);

  function search(content: string) {
    setSearchs([...searchs, content]);
  }

  useInterval(() => {
    if (searchs.length > 0) {
      setInput(searchs.pop());
      setSearchs([]);
    }
  }, 1000);

  return (
    <>
      {error && <ModalError error={error} onGoBack={() => linkTo("/login")} />}
      {isLoading && <ModalLoading />}
      {response && (
        <>
          <View
            style={{
              padding: 20,
              paddingTop: 40,
              backgroundColor: "#eeeee4",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{ width: "20%" }}
              onPress={() => setIsNavOpen(true)}
            >
              <AntIcon name="menufold" size={24} color="black" />
            </TouchableOpacity>
            <View style={{ width: "60%", alignItems: "center" }}>
              {onlySuscription && (
                <Text style={{ fontSize: 16 }}>Tus Suscripciones</Text>
              )}
              {onlyCreator && <Text style={{ fontSize: 16 }}>Tus Mangas</Text>}
              {!onlyCreator && !onlySuscription && (
                <Text style={{ fontSize: 16 }}>Buscar Mangas</Text>
              )}
            </View>
          </View>
          <List
            onSearch={search}
            data={response as MangaResponse[]}
            onSelect={(id) => {
              navigation.push("manga", { id });
            }}
          />
          {isNavOpen && (
            <View
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                backgroundColor: "#eeeee4",
                padding: 20,
                paddingTop: 40,
              }}
            >
              <TouchableOpacity onPress={() => setIsNavOpen(false)}>
                <AntIcon name="menuunfold" size={24} color="black" />
              </TouchableOpacity>
              <View style={{ padding: 20, paddingTop: 40 }}>
                {hasPermission("publicar_manga") && (
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                      navigation.push("manga", {});
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <AntIcon
                        name="plus"
                        size={24}
                        color="black"
                        style={{ padding: 5 }}
                      />
                      <Text>Nuevo Manga</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {hasPermission("publicar_manga") && (
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                      setOnlyCreator(true);
                      setOnlySuscription(false);
                      setInput("");
                      setIsNavOpen(false);
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <AntIcon
                        name="book"
                        size={24}
                        color="black"
                        style={{ padding: 5 }}
                      />
                      <Text>Mis Mangas</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {logged && (
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                      setOnlySuscription(true);
                      setOnlyCreator(false);
                      setInput("");
                      setIsNavOpen(false);
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <AntIcon
                        name="staro"
                        size={24}
                        color="black"
                        style={{ padding: 5 }}
                      />
                      <Text>Suscripciones</Text>
                    </View>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={{ padding: 10 }}
                  onPress={() => {
                    setOnlyCreator(false);
                    setOnlySuscription(false);
                    setInput("");
                    setIsNavOpen(false);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <AntIcon
                      name="search1"
                      size={24}
                      color="black"
                      style={{ padding: 5 }}
                    />
                    <Text>Buscar Mangas</Text>
                  </View>
                </TouchableOpacity>
                {!logged && (
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                      linkTo("/login");
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <AntIcon
                        name="key"
                        size={24}
                        color="black"
                        style={{ padding: 5 }}
                      />
                      <Text>Iniciar Sesion</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {!logged && (
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={() => {
                      linkTo("/register");
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <AntIcon
                        name="form"
                        size={24}
                        color="black"
                        style={{ padding: 5 }}
                      />
                      <Text>Registrarse</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {logged && (
                  <TouchableOpacity
                    style={{ padding: 10 }}
                    onPress={async () => {
                      await clearToken();
                      linkTo("/login");
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <AntIcon
                        name="disconnect"
                        size={24}
                        color="black"
                        style={{ padding: 5 }}
                      />
                      <Text>Cerrar Sesion</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </>
      )}
    </>
  );
};

export default SearchScreen;

import { useLinkTo, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ModalLoading } from '../components/ModalLoading';
import useRequest from '../hooks/useRequest';
import { setToken } from '../utils/store';

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  form: {
    width: "100%",
    padding: 20,
  },
  label: { fontSize: 16, padding: 5 },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    minHeight: 50,
    borderRadius: 10,
    padding: 5,
  },
  activeButton: {
    backgroundColor: "blue",
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
  },
  activeButtonDisabled: {
    opacity: 0,
  },
  activeButtonText: {
    color: "white",
  },
  secondButton: {
    backgroundColor: "#eeeee4",
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
  },
  secondButtonText: {
    color: "black",
  },
});

export const LoginScreen = () => {
  const route = useRoute();
  const linkTo = useLinkTo();

  const [data, setData] = useState({
    correo: "",
    password: "",
  });

  const [localErr, setLocalErr] = useState<string>();
  const [login, send] = useRequest("login");

  const params = route.params as { callbackUrl?: string };

  async function sendLogin() {
    setLocalErr(undefined);
    const canLogin = Object.values(data).filter((d) => !d).length == 0;
    if (canLogin) {
      await send({
        data,
        callBack: async (res) => {
          await setToken(res as string);
        },
      });
      linkTo(params.callbackUrl || "/search");
    } else {
      setLocalErr("Debes ingresar todos los datos");
    }
  }

  return (
    <>
      {login.isLoading && <ModalLoading />}
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={{ fontSize: 32 }}>Iniciar Sesion</Text>
        </View>
        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Correo</Text>
            <TextInput
              textContentType="emailAddress"
              style={styles.input}
              placeholder="Correo"
              value={data.correo}
              onChangeText={(text) => setData({ ...data, correo: text })}
            />
          </View>
          <View>
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
              textContentType="password"
              secureTextEntry
              style={styles.input}
              placeholder="Contraseña"
              value={data.password}
              onChangeText={(text) => setData({ ...data, password: text })}
            />
          </View>
        </View>

        <View style={{ margin: 40, marginBottom: 15, marginTop: 0 }}>
          <Text style={{ fontSize: 12, color: "red" }}>
            {localErr || login.error}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <TouchableOpacity style={styles.activeButton} onPress={sendLogin}>
            <Text style={styles.activeButtonText}>Iniciar Sesion</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondButton}
            onPress={() => linkTo("/register")}
          >
            <Text style={styles.secondButtonText}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

import { useLinkTo, useRoute } from '@react-navigation/native';
import { useState } from 'react';
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

export const RegisterScreen = () => {
  const route = useRoute();

  const linkTo = useLinkTo();

  const [data, setData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    password: "",
  });

  const [localErr, setLocalErr] = useState<string>();
  const [register, send] = useRequest("register");

  const params = route.params as { callbackUrl?: string };

  async function sendRegister() {
    setLocalErr(undefined);
    const canRegister = Object.values(data).filter((d) => !d).length == 0;
    if (canRegister) {
      await send({
        data,
        callBack: async (data) => {
          await setToken(data as string);
        },
      });
      linkTo(params.callbackUrl || "/search");
    } else {
      setLocalErr("Debes ingresar todos los datos");
    }
  }

  return (
    <>
      {register.isLoading && <ModalLoading />}
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={{ fontSize: 32 }}>Registrarse</Text>
        </View>
        <View style={styles.form}>
          <View>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
              textContentType="name"
              style={styles.input}
              placeholder="Ingresa tu nombre"
              value={data.nombre}
              onChangeText={(text) => setData({ ...data, nombre: text })}
            />
          </View>
          <View>
            <Text style={styles.label}>Apellido</Text>
            <TextInput
              textContentType="familyName"
              style={styles.input}
              placeholder="Apellido"
              value={data.apellido}
              onChangeText={(text) => setData({ ...data, apellido: text })}
            />
          </View>
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
            {localErr || register.error}
          </Text>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <TouchableOpacity style={styles.activeButton} onPress={sendRegister}>
            <Text style={styles.activeButtonText}>Crear cuenta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondButton}
            onPress={() => linkTo("/login")}
          >
            <Text style={styles.secondButtonText}>Iniciar Sesion</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

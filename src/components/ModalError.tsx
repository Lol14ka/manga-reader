import { Text, TouchableOpacity, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

import { ModalErrorProps } from './interfaces/ModalError';

export const ModalError = (props: ModalErrorProps) => {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        backgroundColor: "white",
        position: "absolute",
        zIndex: 20,
        elevation: 1,
        top: 0,
        left: 0,
        alignItems: "center",
      }}
    >
      <MaterialIcon name="error-outline" color="blue" size={128} />
      <Text style={{ fontSize: 24, margin: 5 }}>{props.error}</Text>
      <TouchableOpacity
        onPress={props.onGoBack}
        style={{
          backgroundColor: "blue",
          width: 100,
          alignItems: "center",
          padding: 10,
          borderRadius: 5,
          margin: 5,
        }}
      >
        <Text style={{ color: "white" }}>VOLVER</Text>
      </TouchableOpacity>
    </View>
  );
};

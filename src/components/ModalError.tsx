import { Text, TouchableOpacity, View } from 'react-native';

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
      }}
    >
      <Text>{props.error}</Text>
      <TouchableOpacity onPress={props.onGoBack}>
        <Text>VOLVER</Text>
      </TouchableOpacity>
    </View>
  );
};

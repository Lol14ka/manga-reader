import { ActivityIndicator, View } from 'react-native';

export const ModalLoading = () => {
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
      <ActivityIndicator size={64} color="blue" />
    </View>
  );
};

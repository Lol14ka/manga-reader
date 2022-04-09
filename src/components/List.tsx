import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { ListProps } from './interfaces/List';

export const List = (props: ListProps) => {
  const [search, setSearch] = useState<string>();

  useEffect(() => {
    if (search !== undefined) props.onSearch(search);
  }, [search]);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          paddingTop: 40,
          padding: 10,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <TextInput
          style={{
            fontSize: 16,
            borderBottomWidth: 2,
            height: 50,
            width: "50%",
          }}
          placeholder="Buscar manga..."
          onChangeText={setSearch}
          value={search}
        />
      </View>
      <FlatList
        contentContainerStyle={{ alignItems: "center" }}
        data={props.data}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              padding: 5,
              borderRadius: 5,
              elevation: 1,
              shadowColor: "black",
              margin: 5,
              width: 150,
            }}
            onPress={() => {
              if (props.onSelect) props.onSelect(item.id);
            }}
          >
            <View
              style={{
                flex: 1,
                height: 100,
                width: "100%",
                backgroundColor: "black",
              }}
            >
              <Image
                source={{ uri: item.thumb }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", margin: 5 }}>
                {item.nombre}
              </Text>
              <Text style={{ fontSize: 10, margin: 5 }}>
                {item.descripcion}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
    </View>
  );
};

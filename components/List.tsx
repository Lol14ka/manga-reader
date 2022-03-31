import React, { useEffect, useState } from 'react';
import { FlatList, Image, Text, TextInput, View } from 'react-native';

import { MangaData } from './Manga';

interface ListProps {
  data: MangaData[];
  onSearch: (search: string) => void;
}

export const List = (props: ListProps) => {
  const [search, setSearch] = useState<string>();

  useEffect(() => {
    props.onSearch(search || "");
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
          <View
            style={{
              backgroundColor: "white",
              padding: 5,
              borderRadius: 5,
              elevation: 1,
              shadowColor: "black",
              margin: 5,
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
                source={{ uri: item.image_url }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "contain",
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", margin: 5 }}>
                {item.title}
              </Text>
              <Text style={{ fontSize: 10, margin: 5 }}>
                {item.description}
              </Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
      />
    </View>
  );
};

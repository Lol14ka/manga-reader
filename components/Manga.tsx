import { useState } from 'react';
import { Button, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { aspectRatio } from '../utils/aspectRatio';

const screen = Dimensions.get("window");

const styles = StyleSheet.create({
  mangaHeader: {
    backgroundColor: "#eeeee4",
  },
  mangaHeaderData: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: screen.width,
    padding: 30,
    paddingTop: 80,
    alignItems: "center",
  },
  mangaActionsData: {
    justifyContent: "flex-end",
    flexDirection: "row",
    width: screen.width,
    padding: 10,
    alignItems: "center",
  },
  mangaAction: {
    margin: 5,
  },
  mangaImage: {
    resizeMode: "contain",
    height: "100%",
  },
  imageContainer: {
    backgroundColor: "black",
    padding: 5,
  },
  mangaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 5,
    textAlign: "center",
  },
  mangaDescription: {
    fontSize: 12,
    fontWeight: "100",
    textAlign: "center",
  },
  chapterContainer: {
    width: "100%",
    padding: 50,
    textAlign: "center",
    borderBottomColor: "blue",
    borderBottomWidth: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});

interface Chapter {
  id: string;
  title: string;
}

interface MangaData {
  id: string;
  title: string;
  description: string;
  image_url: string;
  chapters: Chapter[];
}

interface MangaProps {
  manga: MangaData;
  onSubscribe?: () => void;
  onEdit?: () => void;
  onOpenChapter?: (id: string) => void;
}

export const Manga = (props: MangaProps) => {
  const [ratio, setRatio] = useState(0);

  const hasActions = props.onSubscribe || props.onEdit;

  return (
    <View>
      <View style={styles.mangaHeader}>
        <View style={styles.mangaHeaderData}>
          <View
            style={{
              ...styles.imageContainer,
              aspectRatio: ratio,
              height: "100%",
              maxWidth: "50%",
            }}
          >
            <Image
              source={{ uri: props.manga.image_url }}
              onLoad={(evt) => {
                const ratio = aspectRatio(
                  evt.nativeEvent.source.width,
                  evt.nativeEvent.source.height
                );
                setRatio(ratio[0] / ratio[1]);
              }}
              style={styles.mangaImage}
            ></Image>
          </View>
          <View style={{ maxWidth: "50%" }}>
            <Text style={styles.mangaTitle}>{props.manga.title}</Text>
            <Text style={styles.mangaDescription}>
              {props.manga.description}
            </Text>
          </View>
        </View>
        {hasActions && (
          <View style={styles.mangaActionsData}>
            {props.onEdit && (
              <View style={styles.mangaAction}>
                <Button title="Editar" color="green" onPress={props.onEdit} />
              </View>
            )}
            {props.onSubscribe && (
              <View style={styles.mangaAction}>
                <Button
                  title="Suscribirse"
                  color="blue"
                  onPress={props.onSubscribe}
                />
              </View>
            )}
          </View>
        )}
      </View>
      <FlatList
        data={props.manga.chapters}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.chapterContainer}
            onPress={() => {
              if (props.onOpenChapter) props.onOpenChapter(item.id);
            }}
          >
            <Text style={{ margin: 5 }}>
              {index + 1} - {item.title}
            </Text>
          </TouchableOpacity>
        )}
        keyExtractor={(i) => i.id}
      />
    </View>
  );
};

/*
<Image
source={{ uri: props.manga.image_url }}
style={styles.mangaImage}
></Image>*/

/*
      <View>
          
      </View>
      <Button title="Right button" onPress={() => {}} />*/

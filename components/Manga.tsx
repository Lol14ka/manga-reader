import { Asset, ImagePicker } from 'expo-image-multiple-picker';
import { useEffect, useState } from 'react';
import { Button, Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

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
    maxHeight: 200,
  },
  mangaTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  mangaDescription: {
    fontSize: 12,
    fontWeight: "100",
    textAlign: "center",
    width: "100%",
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

export interface MangaData {
  id: string;
  title: string;
  description: string;
  image_url: string;
  chapters?: Chapter[];
}

interface MangaPublish {
  title: string;
  description: string;
  image?: Asset;
}

interface MangaProps {
  manga?: MangaData;
  onSubscribe?: () => void;
  onEdit?: (data: MangaPublish) => void;
  onOpenChapter?: (id: string) => void;
  onNewChapter?: () => void;
  onPublish?: (data: MangaPublish) => void;
  editable?: boolean;
}

export const Manga = (props: MangaProps) => {
  const [title, setTitle] = useState<string>(props.manga?.title || "");
  const [description, setDescription] = useState<string>(
    props.manga?.description || ""
  );

  const [image, setImage] = useState<Asset>();
  const [openPicker, setOpenPicker] = useState(false);

  const [ratio, setRatio] = useState(0);

  const [edited, setEdited] = useState(false);

  useEffect(() => {
    if (image) {
      const ratio = aspectRatio(image.width, image.height);
      setRatio(ratio[0] / ratio[1]);
    }
  }, [image]);

  if (openPicker) {
    return (
      <ImagePicker
        onCancel={() => setOpenPicker(false)}
        onSave={(assets) => {
          if (assets && assets.length > 0) {
            setImage(assets[0]);
            setOpenPicker(false);
            if (props.editable) setEdited(true);
          }
        }}
      />
    );
  }

  return (
    <>
      <View>
        <View style={styles.mangaHeader}>
          <View style={styles.mangaHeaderData}>
            {props.manga && !props.editable && (
              <View
                style={{
                  ...styles.imageContainer,
                  aspectRatio: ratio,
                  height: "100%",
                  width: "50%",
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
                />
              </View>
            )}
            {image && !props.manga && (
              <TouchableOpacity
                style={{
                  ...styles.imageContainer,
                  aspectRatio: ratio,
                  height: "100%",
                  width: "50%",
                }}
                onPress={() => setOpenPicker(true)}
              >
                <Image source={{ uri: image.uri }} style={styles.mangaImage} />
              </TouchableOpacity>
            )}
            {props.manga && props.editable && (
              <>
                {!image && (
                  <TouchableOpacity
                    style={{
                      ...styles.imageContainer,
                      aspectRatio: ratio,
                      height: "100%",
                      width: "50%",
                    }}
                    onPress={() => setOpenPicker(true)}
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
                    />
                  </TouchableOpacity>
                )}
                {image && (
                  <TouchableOpacity
                    style={{
                      ...styles.imageContainer,
                      aspectRatio: ratio,
                      height: "100%",
                      width: "50%",
                    }}
                    onPress={() => setOpenPicker(true)}
                  >
                    <Image
                      source={{ uri: image.uri }}
                      style={styles.mangaImage}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
            {!image && !props.manga && (
              <View
                style={{
                  width: "50%",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity onPress={() => setOpenPicker(true)}>
                  <MaterialIcon name="add-a-photo" color="black" size={32} />
                </TouchableOpacity>
              </View>
            )}
            <View
              style={{
                width: "50%",
                flex: 1,
                alignItems: "center",
              }}
            >
              {props.manga && !props.editable && (
                <>
                  <Text style={styles.mangaTitle}>{props.manga.title}</Text>
                  <Text style={styles.mangaDescription}>
                    {props.manga.description}
                  </Text>
                </>
              )}
              {props.manga && props.editable && (
                <>
                  <TextInput
                    multiline
                    placeholder="Titulo"
                    style={styles.mangaTitle}
                    value={title}
                    onChangeText={(value) => {
                      setTitle(value);
                      setEdited(true);
                    }}
                  />
                  <TextInput
                    multiline
                    placeholder="Descripcion"
                    style={styles.mangaDescription}
                    value={description}
                    onChangeText={(value) => {
                      setDescription(value);
                      setEdited(true);
                    }}
                  />
                </>
              )}
              {!props.manga && (
                <>
                  <TextInput
                    multiline
                    placeholder="Titulo"
                    style={styles.mangaTitle}
                    value={title}
                    onChangeText={setTitle}
                  />
                  <TextInput
                    multiline
                    placeholder="Descripcion"
                    style={styles.mangaDescription}
                    value={description}
                    onChangeText={setDescription}
                  />
                </>
              )}
            </View>
          </View>
          <View style={styles.mangaActionsData}>
            {!props.manga && props.onPublish && (
              <View style={styles.mangaAction}>
                <Button
                  title="Publicar"
                  color="blue"
                  onPress={() => {
                    if (props.onPublish) {
                      props.onPublish({
                        image,
                        title,
                        description,
                      });
                    }
                  }}
                />
              </View>
            )}
            {props.manga && props.editable && props.onNewChapter && (
              <View style={styles.mangaAction}>
                <Button
                  title="Capitulo Nuevo"
                  color="green"
                  onPress={props.onNewChapter}
                />
              </View>
            )}
            {props.manga && props.onSubscribe && (
              <View style={styles.mangaAction}>
                <Button
                  title="Suscribirse"
                  color="blue"
                  onPress={props.onSubscribe}
                />
              </View>
            )}
            {props.editable && edited && (
              <View style={styles.mangaAction}>
                <Button
                  title="Grabar"
                  color="red"
                  onPress={() => {
                    if (props.onEdit) {
                      props.onEdit({
                        image,
                        title,
                        description,
                      });
                    }
                  }}
                />
              </View>
            )}
          </View>
        </View>
        {props.manga && (
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
        )}
      </View>
    </>
  );
};

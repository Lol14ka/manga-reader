import { Asset, ImagePicker } from 'expo-image-multiple-picker';
import _ from 'lodash';
import React, { memo, useCallback, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import GridView from 'react-native-draggable-gridview';
import uuid from 'react-native-uuid';
import AntIcon from 'react-native-vector-icons/AntDesign';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface ChapterProps {
  onPublish: (title: string, images: Asset[]) => void;
}

export const Chapter = (props: ChapterProps) => {
  const [title, setTitle] = useState<string>();
  const [images, setImages] = useState<Asset[]>();
  const [openPicker, setOpenPicker] = useState(false);
  const [editing, setEditing] = useState(false);

  const renderLockedItem = useCallback(
    () => (
      <LockedItem
        editing={editing}
        onPress={() => {
          if (!editing) setOpenPicker(true);
          else setEditing(false);
        }}
      />
    ),
    [editing, images]
  );

  const renderItem = useCallback(
    (asset) => (
      <Photo asset={asset} editing={editing} onPressDelete={onPressDelete} />
    ),
    [editing, images]
  );

  const onBeginDragging = useCallback(
    () => !editing && setEditing(true),
    [editing]
  );

  const onReleaseCell = useCallback(
    (assets: Asset[]) => {
      const images_one = assets.slice(1);
      if (!_.isEqual(images, images_one)) setImages(images_one);
    },
    [images]
  );

  const onPressDelete = useCallback(
    (asset: Asset) => {
      const newImages = (images || []).filter((v) => v.id != asset.id);
      setImages(newImages);
      if (newImages.length == 0) setEditing(false);
    },
    [images]
  );

  if (openPicker) {
    return (
      <ImagePicker
        onSave={(assets) => {
          setImages([
            ...(images || []),
            ...assets.map((v, i) => ({ ...v, id: v.id + uuid.v4() })),
          ]);
          setOpenPicker(false);
        }}
        multiple
        onCancel={() => setOpenPicker(false)}
      />
    );
  }

  return (
    <>
      <View
        style={{
          padding: 20,
          paddingTop: 40,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          backgroundColor: "#eeeee4",
        }}
      >
        <TextInput
          style={{ fontSize: 16, maxWidth: "70%", color: "black" }}
          onChangeText={setTitle}
          value={title || ""}
          placeholder="Nombre del capitulo"
          placeholderTextColor="rgba(0,0,0,0.5)"
        />
        <TouchableOpacity
          style={{ opacity: !!title && images && images.length > 0 ? 1 : 0.1 }}
          disabled={!(!!title && images && images.length > 0)}
          onPress={() => props.onPublish(title || "", images || [])}
        >
          <Text style={{ color: "black" }}>PUBLICAR</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <GridView
          data={["+", ...(images || [])]}
          keyExtractor={(item) => (item == "+" ? item : item.id)}
          renderItem={renderItem}
          renderLockedItem={renderLockedItem}
          locked={(item) => item == "+"}
          onBeginDragging={onBeginDragging}
          onPressCell={() => setEditing(true)}
          onReleaseCell={onReleaseCell}
          numColumns={3}
          delayLongPress={editing ? 50 : 500}
        />
      </View>
    </>
  );
};

interface PhotoProps {
  asset: Asset;
  editing: boolean;
  onPressDelete: (asset: Asset) => void;
}

const Photo = memo(({ asset, editing, onPressDelete }: PhotoProps) => {
  return (
    <View style={styles.item}>
      <Image
        source={{ uri: asset.uri }}
        style={{ width: 100, height: 100, resizeMode: "cover" }}
      />
      {editing && <DeleteButton onPress={() => onPressDelete(asset)} />}
    </View>
  );
});

const DeleteButton = memo(({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.delete} onPress={onPress}>
    <View style={styles.deleteContainer}>
      <Text style={{ color: "#fff" }}>x</Text>
    </View>
  </TouchableOpacity>
));

interface LockedItemProps {
  editing: boolean;
  onPress: () => void;
}

const LockedItem = memo(({ editing, onPress }: LockedItemProps) => (
  <TouchableOpacity
    style={{ flex: 1 }}
    activeOpacity={editing ? 1 : 0.5}
    onPress={onPress}
  >
    <View style={styles.item}>
      {!editing && <MaterialIcon name="add-a-photo" color="black" size={32} />}
      {editing && <AntIcon name="checkcircle" color="black" size={32} />}
    </View>
  </TouchableOpacity>
));

const styles = StyleSheet.create({
  item: {
    flex: 1,
    margin: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  delete: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteContainer: {
    width: 20,
    height: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0009",
  },
  header: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#fffe",
    justifyContent: "flex-end",
  },
  headerTitle: {
    position: "absolute",
    width: "100%",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "500",
  },
  headerItem: { fontSize: 18, color: "gray" },
  headerContainer: {
    height: 60,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { LogBox } from 'react-native';
import uuid from 'react-native-uuid';

import config from '../../config';

LogBox.ignoreLogs(["Setting a timer for a long period of time"]);

const firebaseApp = initializeApp(config.firebase);

const storage = getStorage(firebaseApp);

export async function uploadImage(nativePath: string) {
  const storageRef = ref(storage, uuid.v4() + ".jpg");
  const image = await fetch(nativePath);
  const blob = await image.blob();
  const res = await uploadBytes(storageRef, blob);
  return (await getDownloadURL(res.ref)) + ".jpg";
}

export async function scan(object: any) {
  const keys = Object.keys(object);
  let value;
  let i = 0;

  while (i < keys.length) {
    value = object[keys[i]];
    if (typeof value == "object") {
      object[keys[i]] = await scan(value);
    }
    if (typeof value == "string" && value.startsWith("file:///")) {
      object[keys[i]] = await uploadImage(value);
    }
    i++;
  }

  return object;
}

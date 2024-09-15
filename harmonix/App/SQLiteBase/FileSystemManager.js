import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';

// Лимит на активни операции за запазване
const MAX_ACTIVE_OPERATIONS = 3;

// Променливи за следене на разрешенията
let hasMediaLibraryPermission = false;
let hasCameraPermission = false;

// Функция за проверка на разрешение за медийната библиотека
const checkMediaLibraryPermission = async () => {
  if (!hasMediaLibraryPermission) {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.error('Разрешение за достъп до медийната библиотека е отказано');
      return false;
    }
    hasMediaLibraryPermission = true; // Запазваме разрешението
  }
  return true;
};

// Функция за проверка на разрешение за камера
export const checkCameraPermission = async () => {
  if (!hasCameraPermission) {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.error('Разрешение за достъп до камерата е отказано');
      return false;
    }
    hasCameraPermission = true; // Запазваме разрешението
  }
  return true;
};

// Функция за запазване на изображение
export const saveImage = async (uri) => {
  try {
    // Проверка за разрешение само веднъж
    const permissionGranted = await checkMediaLibraryPermission();
    if (!permissionGranted) {
      return null;
    }

    // Намаляване на резолюцията до 800x600 и компресиране на качеството
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800, height: 600 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    );

    // Запазване на изображението в галерията
    const asset = await MediaLibrary.createAssetAsync(manipulatedImage.uri);
    const album = await MediaLibrary.getAlbumAsync('YourAppName');
    if (!album) {
      await MediaLibrary.createAlbumAsync('YourAppName', asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    console.log('Снимката е оптимизирана и запазена успешно');
    return asset.uri;
  } catch (error) {
    console.error('Error optimizing and saving image to gallery:', error);
    return null;
  }
};

// Функция за изтриване на изображение
export const deleteImage = async (uri) => {
  try {
    const asset = await MediaLibrary.getAssetInfoAsync(uri);
    if (asset) {
      await MediaLibrary.deleteAssetsAsync([asset.id]);
      console.log('Снимката е изтрита успешно');
    } else {
      console.error('Снимката не е намерена');
    }
  } catch (error) {
    console.error('Error deleting image from gallery:', error);
  }
};

// Лимитирано асинхронно запазване на изображения
export const processImages = async (images) => {
  const queue = [];
  const results = [];

  for (const image of images) {
    const operation = saveImage(image.uri).then((uri) => {
      if (uri) {
        results.push({ ...image, uri });
      }
    });

    queue.push(operation);

    // Ако достигнем лимита, изчакваме всички операции да завършат
    if (queue.length >= MAX_ACTIVE_OPERATIONS) {
      await Promise.all(queue);
      queue.length = 0;
    }
  }

  // Изчакваме да завършат всички останали операции
  await Promise.all(queue);

  return results;
};

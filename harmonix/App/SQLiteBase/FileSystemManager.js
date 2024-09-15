import * as MediaLibrary from 'expo-media-library';
import * as ImageManipulator from 'expo-image-manipulator';

// Лимит на активни операции за запазване
const MAX_ACTIVE_OPERATIONS = 3;

// Променливи за следене на разрешенията
// let hasMediaLibraryPermission = false;
let hasCameraPermission = false;

// // Функция за проверка на разрешение за медийната библиотека
// const checkMediaLibraryPermission = async () => {
//   if (!hasMediaLibraryPermission) {
//     const { status } = await MediaLibrary.requestPermissionsAsync();
//     if (status !== 'granted') {
//       console.error('Разрешение за достъп до медийната библиотека е отказано');
//       return false;
//     }
//     hasMediaLibraryPermission = true; // Запазваме разрешението
//   }
//   return true;
// };

// Функция за проверка на разрешение за камера
export const checkCameraPermission = async () => {
  if (!hasCameraPermission) {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      return false;
    }
    hasCameraPermission = true; // Запазваме разрешението
  }
  return true;
};

// Функция за запазване на изображение
export const saveImage = async (uri) => {
  try {
    // Проверка за разрешение
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      return null;
    }
    //намиране на съществуващо изображение
    try {
      const asset = await MediaLibrary.getAssetInfoAsync(uri);
      if (asset) {

        return uri;
      }
    } catch (error) {
      console.error(error);
    }
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 800, height: 600 } }],
      { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
    );

    const asset = await MediaLibrary.createAssetAsync(manipulatedImage.uri);
    return asset.uri;
  } catch (error) {
    return null;
  }
};

// Функция за изтриване на изображение
export const deleteImage = async (uri) => {
  try {
    const asset = await MediaLibrary.getAssetInfoAsync(uri);
    if (asset) {
      await MediaLibrary.deleteAssetsAsync([asset.id]);
    } else {
      console.error('Снимката не е намерена');
    }
  } catch (error) {
    console.error('Error deleting image from gallery:', error);
  }
};

// Лимитирано асинхронно запазване на изображения
export const processImages = async (images) => {
  const results = [];
  for (const image of images) {
    const processedUri = await saveImage(image.uri);
    if (processedUri) {
      results.push({ uri: processedUri });
    }
  }
  return results;
};

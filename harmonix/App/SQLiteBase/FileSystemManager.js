// import * as FileSystem from 'expo-file-system';

// const IMAGES_DIRECTORY = FileSystem.documentDirectory + 'inspectionImages/';

// export const saveImage = async (uri) => {
//   try {
//     await FileSystem.makeDirectoryAsync(IMAGES_DIRECTORY, { intermediates: true });
//     const fileName = new Date().getTime() + '.jpg';
//     const newUri = IMAGES_DIRECTORY + fileName;
//     await FileSystem.copyAsync({ from: uri, to: newUri });
//     return newUri;
//   } catch (error) {
//     console.error('Error saving image:', error);
//     return null;
//   }
// };

// export const deleteImage = async (uri) => {
//   try {
//     await FileSystem.deleteAsync(uri);
//   } catch (error) {
//     console.error('Error deleting image:', error);
//   }
// };

// Нова логика 
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

export const saveImage = async (uri) => {
  try {
    // Първо поискаме разрешение за достъп до медийната библиотека
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.error('Разрешение за достъп до медийната библиотека е отказано');
      return null;
    }

    // Копиране на файла във временна директория
    const fileName = new Date().getTime() + '.jpg';
    const newUri = FileSystem.cacheDirectory + fileName;
    await FileSystem.copyAsync({ from: uri, to: newUri });

    // Запазване на файла в галерията
    const asset = await MediaLibrary.createAssetAsync(newUri);
    const album = await MediaLibrary.getAlbumAsync('YourAppName');
    if (album == null) {
      await MediaLibrary.createAlbumAsync('YourAppName', asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
    }

    console.log('Снимката е запазена успешно в галерията');
    return asset.uri;
  } catch (error) {
    console.error('Error saving image to gallery:', error);
    return null;
  }
};

export const deleteImage = async (uri) => {
  try {
    const asset = await MediaLibrary.getAssetInfoAsync(uri);
    if (asset) {
      await MediaLibrary.deleteAssetsAsync([asset.id]);
      console.log('Снимката е изтрита успешно от галерията');
    } else {
      console.error('Снимката не е намерена в галерията');
    }
  } catch (error) {
    console.error('Error deleting image from gallery:', error);
  }
};

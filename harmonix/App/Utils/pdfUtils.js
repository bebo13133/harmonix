import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
export const generatePDF = async (inspection) => {
  try {
    const html = `
      <html>
        <body>
          <h1>Inspection Report for ${inspection.projectNumber}</h1>
          <p>Date: ${inspection.date}</p>
          <p>Inspector: ${inspection.inspectorName}</p>
          <p>Status: ${inspection.status}</p>
          <p>Score: ${inspection.score}%</p>
          <p>Address: ${inspection.address}</p>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    console.log(`PDF generated at: ${uri}`);
    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const downloadPDF = async (inspection) => {
    try {
      const pdfUri = await generatePDF(inspection);
      const fileName = `inspection_${inspection.id}.pdf`;
      let downloadPath;
  
      if (Platform.OS === 'android') {
        // За Android, пазя Downloads директорията
        downloadPath = `${FileSystem.cacheDirectory}${fileName}`;
        await FileSystem.copyAsync({
          from: pdfUri,
          to: downloadPath
        });
  
        const contentUri = await FileSystem.getContentUriAsync(downloadPath);
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: contentUri,
          flags: 1,
          type: 'application/pdf',
        });
  
      } else {
        //  в директория на приложението
        downloadPath = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.copyAsync({
          from: pdfUri,
          to: downloadPath
        });
      }
  
      console.log(`PDF saved to: ${downloadPath}`);
      return downloadPath;
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  };

export const sharePDF = async (inspection) => {
  try {
    const pdfUri = await generatePDF(inspection);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: `Inspection Report - ${inspection.projectNumber}`,
      });
    } else {
      throw new Error("Sharing isn't available on this platform");
    }
  } catch (error) {
    console.error('Error sharing PDF:', error);
    throw error;
  }
};
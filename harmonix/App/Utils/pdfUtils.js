import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import harmonixLogo from '../../assets/harmonix.png';
import { EnvFormQuestions } from '../Screens/Forms/EnvFormQuestions';
import { QaFormQuestions } from '../Screens/Forms/QaFormQuestions';
import { DcFormQuestions } from '../Screens/Forms/DcFormQuestions';
import hsFormQuestions from '../Screens/Forms/hsFormQuestions';
import { getBase64FromAssets } from '../SQLiteBase/FileSystemManager';

const checkmarkIcon = '✔️'; // 
const dash = '-'; 

const getQuestions = (formType) => {
    switch (formType) {
        case 'healthSafety':
            return hsFormQuestions;
        case 'environmental':
            return EnvFormQuestions;
        case 'qualityAssurance':
            return QaFormQuestions;
        case 'documentControl':
            return DcFormQuestions;
        default:
            console.warn('Unknown form type:', formType);
            return {};
    }
};

export const generatePDF = async (inspection) => {
    try {
      const logoUri = await getBase64FromAssets(harmonixLogo);
        const formQuestions = getQuestions(inspection.formType);

        const html = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>Inspection Report - ${inspection.projectNumber}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .logo {
              max-width: 200px;
              margin-bottom: 10px;
            }
            h1 {
              color: #2c3e50;
              border-bottom: 2px solid #3498db;
              padding-bottom: 10px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            .info-item {
              background-color: #f9f9f9;
              padding: 10px;
              border-radius: 5px;
            }
            .info-label {
              font-weight: bold;
              color: #2980b9;
            }
            .section {
              margin-bottom: 20px;
            }
            .section-title {
              background-color: #3498db;
              color: white;
              padding: 10px;
              border-radius: 5px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
            }
            .checkmark {
              color: green;
              font-size: 18px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${logoUri}" alt="Harmonix Logo" class="logo">
            <h1>Inspection Report</h1>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <p><span class="info-label">Project Number:</span> ${inspection.projectNumber}</p>
              <p><span class="info-label">Date:</span> ${new Date(inspection.date).toLocaleDateString()}</p>
              <p><span class="info-label">Inspector:</span> ${inspection.inspectorName}</p>
            </div>
            <div class="info-item">
              <p><span class="info-label">Status:</span> ${inspection.completionPercentage < 100 ? 'Draft' : 'Complete'}</p>
              <p><span class="info-label">Score:</span> ${inspection.score}%</p>
              <p><span class="info-label">Address:</span> ${inspection.address}</p>
            </div>
          </div>
          
          <div class="section">
            <h2 class="section-title">Inspection Details</h2>
            <table>
              <tr>
                <th>Section</th>
                <th>Status</th>
                <th>Comments</th>
              </tr>
              ${Object.entries(inspection.formSections).map(([sectionKey, sectionData]) => {
                  const sectionQuestions = formQuestions[sectionKey]?.questions;
                  if (!sectionQuestions) {
                      console.warn(`No questions found for section ${sectionKey}`);
                      return '';
                  }

                  const totalQuestions = sectionQuestions.length;
                  const statuses = Object.values(sectionData.selectedStatuses || []);

                  const isCompleted = statuses.length === totalQuestions && statuses.every(status => ['Green', 'Amber', 'Red'].includes(status));

                  const hasComments = Object.values(sectionData.comments || {}).some(comment => comment && comment.trim() !== '');
                  
                  return `
                    <tr>
                      <td>${sectionKey}</td>
                      <td>${isCompleted ? 'Completed' : 'N/A'}</td>
                      <td class="checkmark">${hasComments ? checkmarkIcon : dash}</td>
                    </tr>
                  `;
              }).join('')}
            </table>
          </div>
          
          <div class="section">
            <h2 class="section-title">General Comments</h2>
            <p>${inspection.generalComments || 'No general comments provided.'}</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">Advisory</h2>
            <p>${inspection.advisory || 'No advisory provided.'}</p>
          </div>
          
          <footer>
            <p>Report generated on ${new Date().toLocaleString()}</p>
            <p>© ${new Date().getFullYear()} Harmonix Inspection Services</p>
          </footer>
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

import { post, get } from '../API/requester';
import { initDatabase, saveInspectorsToDb } from '../SQLiteBase/DatabaseManager';

const baseUrl = 'https://harmonix.emage.co.uk/api';

const startInspectionService = {
  completedInThePresenceOf: async () => {
    try {
      const response = await get(`${baseUrl}/completedInThePresenceOf`);

      const inspectorsArray = Object.entries(response).map(([id, name]) => ({ id, name }));

      const db = await initDatabase();
      if (db) {
        await saveInspectorsToDb(db, inspectorsArray);
      }

      return response;
    } catch (error) {
      console.error('completedInThePresenceOf error:', error);
      return null; // Return null instead of throwing
    }
  },
};

export default startInspectionService;

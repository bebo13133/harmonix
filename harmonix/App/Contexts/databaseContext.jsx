import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  initDatabase,
  loadInspectorsFromDb,
  saveInspectorsToDb,
  saveFormDataToDb,
  loadFormDataFromDb,
  updateFormDataInDb,
  deleteInspectionFromDb,
} from '../SQLiteBase/DatabaseManager';

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [database, setDatabase] = useState(null);

  useEffect(() => {
    const initDB = async () => {
      const db = await initDatabase();
      setDatabase(db);
    };

    initDB();
  }, []);

  const contextValue = {
    database,
    loadInspectors: async () => {
      if (!database) return [];
      return await loadInspectorsFromDb(database);
    },
    saveInspectors: async (inspectors) => {
      if (!database) return;
      await saveInspectorsToDb(database, inspectors);
    },
    saveFormData: async (data) => {
      if (!database) return;
      await saveFormDataToDb(database, data);
    },
    loadFormData: async () => {
      if (!database) return [];
      return await loadFormDataFromDb(database);
    },
    updateFormData: async (data) => {
      if (!database) return;
      await updateFormDataInDb(database, data);
    },
    deleteInspection: async (id) => {
      if (!database) return;
      await deleteInspectionFromDb(database, id);
    },
  };

  return <DatabaseContext.Provider value={contextValue}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = () => useContext(DatabaseContext);

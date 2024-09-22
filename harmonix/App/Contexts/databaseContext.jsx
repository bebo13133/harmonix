import React, { createContext, useState, useContext, useEffect } from 'react';
import { initDatabase, saveFormDataToDb, loadFormDataFromDb, updateFormDataInDb, deleteInspectionFromDb } from '../SQLiteBase/DatabaseManager';
import { saveDataToDb, loadDataFromDb, loadSitesFromDb, saveSitesToDb } from '../SQLiteBase/BackendDataSync';

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

  const createDataHandler = (tableName, loadFunc = loadDataFromDb, saveFunc = saveDataToDb) => ({
    load: async () => {
      if (!database) return [];
      return await loadFunc(database, tableName);
    },
    save: async (data) => {
      if (!database) return;
      await saveFunc(database, tableName, data);
    },
  });

  const saveFormData = async (data) => {
    if (!database) return;
    await saveFormDataToDb(database, data);
  };

  const loadFormData = async () => {
    if (!database) return [];
    return await loadFormDataFromDb(database);
  };

  const updateFormData = async (data) => {
    if (!database) return;
    await updateFormDataInDb(database, data);
  };

  const deleteInspection = async (id) => {
    if (!database) return;
    await deleteInspectionFromDb(database, id);
  };

  const contextValue = {
    database,
    completedInThePresenceOf: createDataHandler('completedInThePresenceOf'),
    divisionalDirector: createDataHandler('divisionalDirector'),
    sites: createDataHandler('sites', loadSitesFromDb, (db, _, data) => saveSitesToDb(db, data)),
    projectDirector: createDataHandler('projectDirector'),
    personInControl: createDataHandler('personInControl'),
    saveFormData,
    loadFormData,
    updateFormData,
    deleteInspection,
  };

  return <DatabaseContext.Provider value={contextValue}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = () => useContext(DatabaseContext);

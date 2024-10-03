import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  initDatabase,
  saveFormDataToDb,
  loadFormDataFromDb,
  updateFormDataInDb,
  deleteInspectionFromDb,
  reinitializeDatabase,
} from '../SQLiteBase/DatabaseManager';
import { saveDataToDb, loadDataFromDb, loadSitesFromDb, saveSitesToDb, saveQuestionsDataToDb } from '../SQLiteBase/BackendDataSync';

const DatabaseContext = createContext();

export const DatabaseProvider = ({ children }) => {
  const [database, setDatabase] = useState(null);
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbChangeCounter, setDbChangeCounter] = useState(0);

  const incrementDbChangeCounter = () => {
    setDbChangeCounter((prevCounter) => prevCounter + 1);
  };

  useEffect(() => {
    const initDB = async () => {
      const db = await initDatabase();
      setDatabase(db);
      setIsDbReady(true);
    };

    initDB();
  }, []);

  const createDataHandler = (tableName, loadFunc = loadDataFromDb, saveFunc = saveDataToDb) => ({
    load: async () => await loadFunc(database, tableName),
    save: async (data) => {
      await saveFunc(database, tableName, data);
      incrementDbChangeCounter();
    },
  });

  const saveFormData = async (data) => await saveFormDataToDb(database, data);
  const loadFormData = async () => await loadFormDataFromDb(database);
  const updateFormData = async (data) => await updateFormDataInDb(database, data);
  const deleteInspection = async (id) => await deleteInspectionFromDb(database, id);

  const dropDB = async () => {
    setIsDbReady(false);
    await reinitializeDatabase(database);
    setIsDbReady(true);
  };

  const contextValue = {
    database,
    completedInThePresenceOf: createDataHandler('completedInThePresenceOf'),
    divisionalDirector: createDataHandler('divisionalDirector'),
    sites: createDataHandler('sites', loadSitesFromDb, (db, _, data) => saveSitesToDb(db, data)),
    projectDirector: createDataHandler('projectDirector'),
    personInControl: createDataHandler('personInControl'),
    qualityQuestions: createDataHandler('qualityQuestions', loadDataFromDb, saveQuestionsDataToDb),
    saveFormData,
    loadFormData,
    updateFormData,
    deleteInspection,
    dropDB,
    isDbReady,
    dbChangeCounter,
  };

  if (!isDbReady) return null;

  return <DatabaseContext.Provider value={contextValue}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = () => useContext(DatabaseContext);

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Text } from 'react-native';
import {
  initDatabase,
  saveFormDataToDb,
  loadFormDataFromDb,
  deleteFormFromDb,
  updateFormDataInDb,
  deleteInspectionFromDb,
} from '../SQLiteBase/DatabaseManager';
import { useNavigation } from '@react-navigation/native';
import { useAsyncStorage } from '../Hooks/useAsyncStorage';
import userService from '../Services/userService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [auth, setAuth] = useAsyncStorage('auth', {});
  const [userData, setUserData] = useAsyncStorage('userData', {});
  const [formData, setFormData] = useState(null);
  const [db, setDb] = useState(null);
  const [savedForms, setSavedForms] = useState([]);
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    const initDb = async () => {
      try {
        const database = await initDatabase();
        if (database) {
          setDb(database);
          setIsDbReady(true);
          await loadAllForms(database);
        } else {
          throw new Error('Database was not initialized correctly');
        }
      } catch (error) {
        setIsDbReady(false);
        setDbError(error.message || 'Unknown error during database initialization');
      }
    };
    initDb();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await userService.login(email, password);
      setAuth({ token: userData.token, email: userData.user.email });
      setUserData({ email: userData.user.email, id: userData.user.id });
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };
  const onLogout = async () => {
    try {
      await userService.logout();
      setAuth({});
      setUserData({});
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };
  const saveFormData = async (data) => {
    if (!isDbReady || !db) {
      throw new Error('Database is not ready');
    }
    try {
      const currentDate = new Date().toISOString();
      const formToSave = {
        ...data,
        date: currentDate.split('T')[0],
        status: data.isComplete ? 'Completed' : 'Draft',
        completionPercentage: calculateCompletionPercentage(data),
        score: calculateScore(data),
        lastModified: currentDate,
      };
      await saveFormDataToDb(db, formToSave);
      setFormData(formToSave);
      await loadAllForms(db);
    } catch (error) {
      console.error('Error saving data:', error);
      throw error;
    }
  };

  const loadAllForms = async (database) => {
    if (!database) {
      console.error('UserContext: Database is not initialized');
      return;
    }
    try {
      const forms = await loadFormDataFromDb(database);
      setSavedForms(forms);
    } catch (error) {
      console.error('UserContext: Error loading all forms:', error);
    }
  };

  const deleteForm = async (id) => {
    if (!isDbReady || !db) {
      throw new Error('Database is not ready');
    }
    try {
      await deleteFormFromDb(db, id);
      await loadAllForms(db);
    } catch (error) {
      console.error('Error deleting form:', error);
      throw error;
    }
  };

  const calculateCompletionPercentage = (data) => {
    const totalFields = Object.keys(data).length;
    const filledFields = Object.values(data).filter((value) => value !== null && value !== '').length;
    return Math.round((filledFields / totalFields) * 100);
  };

  const calculateScore = (data) => {
    return Math.floor(Math.random() * 100);
  };
  const updateFormData = async (data) => {
    if (!isDbReady || !db) {
      throw new Error('Database is not ready');
    }
    try {
      const updatedFormData = {
        ...data,
        lastModified: new Date().toISOString(),
      };
      await updateFormDataInDb(db, updatedFormData);
      await loadAllForms(db);
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  };
  const deleteInspection = async (id) => {
    if (!isDbReady || !db) {
      throw new Error('Database is not ready');
    }
    try {
      await deleteInspectionFromDb(db, id);
      await loadAllForms(db);
    } catch (error) {
      console.error('Error deleting inspection:', error);
      throw error;
    }
  };

  const contextValue = {
    isAuthenticated: !!auth.token,
    formData,
    saveFormData,
    loadFormData: () => loadAllForms(db),
    db,
    savedForms,
    isDbReady,
    deleteForm,
    updateFormData,
    deleteInspection,
    login,
    token: auth.token,
    onLogout,
    userData,
  };

  return (
    <UserContext.Provider value={contextValue}>{isDbReady ? children : <Text>Loading database... {dbError && `Error: ${dbError}`}</Text>}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

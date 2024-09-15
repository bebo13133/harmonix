import React, { createContext, useState, useContext, useEffect } from 'react';
import { Text } from 'react-native';
import { initDatabase, saveFormDataToDb, loadFormDataFromDb, deleteFormFromDb } from '../SQLiteBase/DatabaseManager';
import { useNavigation } from '@react-navigation/native';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [formData, setFormData] = useState(null);
    const [db, setDb] = useState(null);
    const [savedForms, setSavedForms] = useState([]);
    const [isDbReady, setIsDbReady] = useState(false);
    const [dbError, setDbError] = useState(null);
   
    useEffect(() => {
        const initDb = async () => {
            try {
                console.log('UserContext: Starting database initialization...');
                const database = await initDatabase();
                if (database) {
                    console.log('UserContext: Database initialized successfully');
                    setDb(database);
                    setIsDbReady(true);
                    await loadAllForms(database);
                } else {
                    throw new Error('Database was not initialized correctly');
                }
            } catch (error) {
                console.error('UserContext: Critical error during database initialization:', error);
                setIsDbReady(false);
                setDbError(error.message || 'Unknown error during database initialization');
            }
        };
        initDb();
    }, []);

    const saveFormData = async (data) => {
        if (!isDbReady || !db) {
            console.error('Database is not ready');
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
            console.log('UserContext: Attempting to load all forms...');
            const forms = await loadFormDataFromDb(database);
            setSavedForms(forms);
            console.log('UserContext: Forms loaded successfully', forms);
        } catch (error) {
            console.error('UserContext: Error loading all forms:', error);
        }
    };

    const deleteForm = async (id) => {
        if (!isDbReady || !db) {
            console.error('Database is not ready');
            throw new Error('Database is not ready');
        }
        try {
            await deleteFormFromDb(db, id);
            await loadAllForms(db);
            console.log('Form deleted successfully');
        } catch (error) {
            console.error('Error deleting form:', error);
            throw error;
        }
    };

    const calculateCompletionPercentage = (data) => {
        const totalFields = Object.keys(data).length;
        const filledFields = Object.values(data).filter(value => value !== null && value !== '').length;
        return Math.round((filledFields / totalFields) * 100);
    };

    const calculateScore = (data) => {
        return Math.floor(Math.random() * 100);
    };

    const contextValue = {
        isAuthenticated, 
        setIsAuthenticated, 
        formData, 
        saveFormData,
        loadFormData: () => loadAllForms(db),
        db,
        savedForms,
        isDbReady,
        deleteForm
    };

    return (
        <UserContext.Provider value={contextValue}>
            {isDbReady ? children : <Text>Loading database... {dbError && `Error: ${dbError}`}</Text>}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

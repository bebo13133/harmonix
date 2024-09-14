import React, { createContext, useState, useContext, useEffect } from 'react';
import { initDatabase, saveFormDataToDb, loadFormDataFromDb } from '../SQLiteBase/DatabaseManager';
import * as SQLite from 'expo-sqlite';

// Създаване на контекста
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    const [formData, setFormData] = useState(null);
    const [db, setDb] = useState(null);

    useEffect(() => {
        const initDb = async () => {
            try {
                // Инициализация на базата данни с expo-sqlite
                const database = await initDatabase();
                if (database) {
                    setDb(database);
                    console.log('База данни инициализирана успешно');
                } else {
                    throw new Error('База данни не е инициализирана правилно');
                }
            } catch (error) {
                console.error('Грешка при инициализиране на базата данни:', error);
            }
        };
        initDb();
    }, []);

    const saveFormData = async (data) => {
        if (db) {
            try {
                await saveFormDataToDb(db, data); // Предаваме db и данните към функцията
                setFormData(data);
                console.log('Данните са запазени успешно',data);
              
            } catch (error) {
                console.error('Грешка при запазване на данните:', error);
                throw error;
            }
        } else {
            console.error('База данни не е инициализирана');
            throw new Error('База данни не е инициализирана');
        }
    };

    const loadFormData = async () => {
        if (db) {
            try {
                const data = await loadFormDataFromDb(db); // Предаваме db към функцията
                if (data) {
                    setFormData(data);
                    console.table('Данните са заредени успешно:', data);
                    const { WELFARE } = data;
                    console.log('Подпис:', WELFARE);
                }
            } catch (error) {
                console.error('Грешка при зареждане на данните:', error);
                throw error;
            }
        } else {
            console.error('База данни не е инициализирана');
            throw new Error('База данни не е инициализирана');
        }
    };

    const contextValue = {
        isAuthenticated, 
        setIsAuthenticated, 
        formData, 
        saveFormData,
        loadFormData,
        db
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

// Hook за достъп до контекста
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

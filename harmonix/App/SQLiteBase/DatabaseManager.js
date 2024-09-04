import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = "HSForm.db";

// Инициализиране на базата данни
export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS inspections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        projectId TEXT,
        inspectorId TEXT,
        personInControlId TEXT,
        projectDirectorId TEXT,
        divisionalDirectorId TEXT,
        generalComments TEXT,
        advisory TEXT,
        signature TEXT,
        formSections TEXT,
        date TEXT,
        status TEXT
      );
    `);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    return null;
  }
};

// Запазване на данни във базата данни
export const saveFormDataToDb = async (db, data) => {
  try {
    await db.runAsync(`
      INSERT INTO inspections (
        projectId, inspectorId, personInControlId, projectDirectorId, 
        divisionalDirectorId, generalComments, advisory, signature, 
        formSections, date, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [
      data.selectedProject,
      data.selectedInspector,
      data.selectedPersonInControl,
      data.selectedProjectDirector,
      data.selectedDivisionalDirector,
      data.generalComments,
      data.advisory,
      JSON.stringify(data.signature),
      JSON.stringify(data.formSections),
      data.date,
      data.status
    ]);

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

// Зареждане на данни от базата данни
export const loadFormDataFromDb = async (db) => {
  try {
    const firstRow = await db.getFirstAsync('SELECT * FROM inspections ORDER BY id DESC LIMIT 1;');

    if (firstRow) {
      firstRow.signature = JSON.parse(firstRow.signature);
      firstRow.formSections = JSON.parse(firstRow.formSections);
      console.log('Data loaded successfully:', firstRow);
      return firstRow;
    } else {
      console.log('No data found.');
      return null;
    }
  } catch (error) {
    console.error('Error loading data from database:', error);
  }
};

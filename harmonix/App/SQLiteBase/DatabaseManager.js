import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = "HSForm.db";

export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    await db.execAsync(`PRAGMA journal_mode = WAL;`);

    await createTableIfNotExists(db);
    await addMissingColumns(db);

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    return null;
  }
};

const createTableIfNotExists = async (db) => {
  await db.execAsync(`
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
};

const addMissingColumns = async (db) => {
  const columnsToAdd = [
    'projectNumber TEXT',
    'address TEXT',
    'completionPercentage INTEGER',
    'score INTEGER',
    'formType TEXT',
    'inspectorName TEXT',
    'lastModified TEXT'
  ];

  for (const column of columnsToAdd) {
    const [columnName, columnType] = column.split(' ');
    await db.execAsync(`
      ALTER TABLE inspections ADD COLUMN ${columnName} ${columnType};
    `).catch(error => {
 
      if (!error.message.includes('duplicate column name')) {
        console.error(`Error adding column ${columnName}:`, error);
      }
    });
  }
};

export const saveFormDataToDb = async (db, data) => {
  try {
    await db.runAsync(`
      INSERT INTO inspections (
        projectNumber, date, address, status, completionPercentage, 
        score, formType, inspectorName, lastModified, projectId, 
        inspectorId, personInControlId, projectDirectorId, 
        divisionalDirectorId, generalComments, advisory, signature, 
        formSections
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [
      data.projectNumber,
      data.date,
      data.address,
      data.status,
      data.completionPercentage,
      data.score,
      data.formType,
      data.inspectorName,
      data.lastModified,
      data.projectId,
      data.inspectorId,
      data.personInControlId,
      data.projectDirectorId,
      data.divisionalDirectorId,
      data.generalComments,
      data.advisory,
      JSON.stringify(data.signature),
      JSON.stringify(data.formSections)
    ]);

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
};

export const loadFormDataFromDb = async (db) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM inspections ORDER BY id DESC;');
    const forms = result.map(row => ({
      ...row,
      signature: JSON.parse(row.signature),
      formSections: JSON.parse(row.formSections)
    }));
    console.log('Data loaded successfully:', forms);
    return forms;
  } catch (error) {
    console.error('Error loading data from database:', error);
    throw error;
  }
};
export const deleteFormFromDb = async (db, id) => {
  try {
    await db.runAsync(`
      DELETE FROM inspections WHERE id = ?;
    `, [id]);

    console.log("Form deleted successfully");
  } catch (error) {
    console.error("Error deleting form:", error);
    throw error;
  }
};
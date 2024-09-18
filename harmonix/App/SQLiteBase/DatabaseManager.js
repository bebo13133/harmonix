import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'HSForm.db';

export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    await db.execAsync(`PRAGMA journal_mode = WAL;`);

    await createTableIfNotExists(db);
    await addMissingColumns(db);

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
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS inspectors (
      id TEXT PRIMARY KEY,
      name TEXT
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
    'lastModified TEXT',
  ];

  for (const column of columnsToAdd) {
    const [columnName, columnType] = column.split(' ');
    await db
      .execAsync(
        `
      ALTER TABLE inspections ADD COLUMN ${columnName} ${columnType};
    `
      )
      .catch((error) => {
        if (!error.message.includes('duplicate column name')) {
          console.error(`Error adding column ${columnName}:`, error);
        }
      });
  }
};

export const saveFormDataToDb = async (db, data) => {
  try {
    await db.runAsync(
      `
      INSERT INTO inspections (
        projectNumber, date, address, status, completionPercentage, 
        score, formType, inspectorName, lastModified, projectId, 
        inspectorId, personInControlId, projectDirectorId, 
        divisionalDirectorId, generalComments, advisory, signature, 
        formSections
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `,
      [
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
        JSON.stringify(data.formSections),
      ]
    );
  } catch (error) {
    console.error('Error inserting data:', error);
    throw error;
  }
};

export const loadFormDataFromDb = async (db) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM inspections ORDER BY id DESC;');
    const forms = result.map((row) => ({
      ...row,
      signature: JSON.parse(row.signature),
      formSections: JSON.parse(row.formSections),
    }));
    return forms;
  } catch (error) {
    console.error('Error loading data from database:', error);
    throw error;
  }
};
export const deleteFormFromDb = async (db, id) => {
  try {
    await db.runAsync(
      `
      DELETE FROM inspections WHERE id = ?;
    `,
      [id]
    );
  } catch (error) {
    console.error('Error deleting form:', error);
    throw error;
  }
};
export const updateFormDataInDb = async (db, data) => {
  try {
    await db.runAsync(
      `
      UPDATE inspections SET
      projectNumber = ?,
      date = ?,
      address = ?,
      status = ?,
      completionPercentage = ?,
      score = ?,
      formType = ?,
      inspectorName = ?,
      lastModified = ?,
      projectId = ?,
      inspectorId = ?,
      personInControlId = ?,
      projectDirectorId = ?,
      divisionalDirectorId = ?,
      generalComments = ?,
      advisory = ?,
      signature = ?,
      formSections = ?
      WHERE id = ?
    `,
      [
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
        JSON.stringify(data.formSections),
        data.id,
      ]
    );
  } catch (error) {
    console.error('Error updating form:', error);
    throw error;
  }
};
export const deleteInspectionFromDb = async (db, id) => {
  try {
    await db.runAsync(
      `
          DELETE FROM inspections WHERE id = ?;
      `,
      [id]
    );
  } catch (error) {
    console.error('Error deleting inspection:', error);
    throw error;
  }
};

export const saveInspectorsToDb = async (db, inspectors) => {
  if (!Array.isArray(inspectors)) {
    console.error('Expected array of inspectors, got:', typeof inspectors);
    return;
  }

  try {
    await db.runAsync('BEGIN TRANSACTION;');
    for (const inspector of inspectors) {
      if (typeof inspector !== 'object' || !inspector.id || !inspector.name) {
        console.error('Invalid inspector object:', inspector);
        continue;
      }
      await db.runAsync(
        `
        INSERT OR REPLACE INTO inspectors (id, name)
        VALUES (?, ?);
      `,
        [inspector.id, inspector.name]
      );
    }
    await db.runAsync('COMMIT;');
  } catch (error) {
    await db.runAsync('ROLLBACK;');
    console.error('Error inserting inspectors:', error);
    throw error;
  }
};

export const loadInspectorsFromDb = async (db) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM inspectors;');
    return result;
  } catch (error) {
    console.error('Error loading inspectors from database:', error);
    throw error;
  }
};

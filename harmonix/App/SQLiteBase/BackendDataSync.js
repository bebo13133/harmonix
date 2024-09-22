export const saveDataToDb = async (db, tableName, data) => {
  if (!Array.isArray(data)) {
    console.error(`Expected array of ${tableName}, got:`, typeof data);
    return;
  }

  for (const item of data) {
    if (typeof item !== 'object' || !item.id || !item.name) {
      console.error(`Invalid ${tableName} object:`, item);
      continue;
    }
    await db.runAsync(
      `
            INSERT OR REPLACE INTO ${tableName} (id, name)
            VALUES (?, ?);
          `,
      [item.id, item.name]
    );
  }
};

export const loadDataFromDb = async (db, tableName) => {
  try {
    const result = await db.getAllAsync(`SELECT * FROM ${tableName};`);
    return result;
  } catch (error) {
    console.error(`Error loading ${tableName} from database:`, error);
    throw error;
  }
};

export const saveSitesToDb = async (db, sites) => {
  console.log(sites[0]);
  if (!Array.isArray(sites)) {
    console.error('Expected array of sites, got:', typeof sites);
    return;
  }

  for (const site of sites) {
    await db.runAsync(
      `
            INSERT OR REPLACE INTO sites (
              id, project_number, progress, address1, address2, address3, city, postcode,
              latitude, longitude, arhive, image, created_at, updated_at, deleted_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
          `,
      [
        site.id,
        site.project_number,
        site.progress,
        site.address1,
        site.address2,
        site.address3,
        site.city,
        site.postcode,
        site.latitude,
        site.longitude,
        site.arhive,
        site.image,
        site.created_at,
        site.updated_at,
        site.deleted_at,
      ]
    );
  }
};

export const loadSitesFromDb = async (db) => {
  try {
    const result = await db.getAllAsync('SELECT * FROM sites;');
    return result;
  } catch (error) {
    console.error('Error loading sites from database:', error);
    throw error;
  }
};

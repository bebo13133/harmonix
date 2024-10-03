import { get } from '../API/requester';

const baseUrl = 'https://harmonix.emage.co.uk/api';

const createFetchService =
  (endpoint, transformResponse = (r) => r) =>
  async (saveFunction) => {
    if (typeof saveFunction !== 'function') {
      console.error(`saveFunction is not a function for ${endpoint}`);
      return;
    }
    try {
      const response = await get(`${baseUrl}/${endpoint}`);
      const transformedData = transformResponse(response);

      const logStructuredData = (object) => {
        for (const [key, value] of Object.entries(object)) {
          console.log(`${key}:`);
          if (typeof value === 'object' && value !== null) {
            for (const [subKey, subValue] of Object.entries(value)) {
              console.log(`  ${subKey}: ${JSON.stringify(subValue)}`);
            }
          } else {
            console.log(`  ${value}`);
          }
          console.log('---');
        }
      };
      logStructuredData(transformedData);
      await saveFunction(transformedData);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      throw err;
    }
  };

const mapToIdNameArray = (response) => Object.entries(response).map(([id, name]) => ({ id, name }));

const filterArray = (response) => {
  const test = {
    inspectionType: null,
  };
  response.forEach((x) => {
    if (!test.inspectionType) {
      test.inspectionType = x.inspection_type_id;
    }
    if (x.parent_id === null) {
      test[x.id] = {
        fieldName: x.field_name,
      };
    } else {
      test[x.id] = {
        fieldName: x.field_name,
        marks: null,
        message: null,
        photo: [],
      };
    }
  });
  return test;
};

const backgroundServices = {
  getCompletedInThePresenceOf: createFetchService('completedInThePresenceOf', mapToIdNameArray),
  getDivisionalDirector: createFetchService('divisionalDirector', mapToIdNameArray),
  getSites: createFetchService('sites'),
  getProjectDirector: createFetchService('projectDirector', mapToIdNameArray),
  getPersonInControl: createFetchService('personInControl', mapToIdNameArray),
  getHsQuestions: createFetchService('hs'),
  getQualityQuestions: createFetchService('quality', filterArray),
};

export default backgroundServices;

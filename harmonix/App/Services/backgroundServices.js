import { get } from '../API/requester';

const baseUrl = 'https://harmonix.emage.co.uk/api';

const createFetchService =
  (endpoint, transformResponse = (r) => r) =>
  async (saveFunction) => {
    try {
      const response = await get(`${baseUrl}/${endpoint}`);
      if (endpoint === 'sites') {
        console.log(response[1]);
        console.log('asd');
      }
      const transformedData = transformResponse(response);
      await saveFunction(transformedData);
    } catch (err) {
      console.error(`Error fetching ${endpoint}:`, err);
      throw err;
    }
  };

const mapToIdNameArray = (response) => Object.entries(response).map(([id, name]) => ({ id, name }));

const backgroundServices = {
  getCompletedInThePresenceOf: createFetchService('completedInThePresenceOf', mapToIdNameArray),
  getDivisionalDirector: createFetchService('divisionalDirector', mapToIdNameArray),
  getSites: createFetchService('sites'),
  getProjectDirector: createFetchService('projectDirector', mapToIdNameArray),
  getPersonInControl: createFetchService('personInControl', mapToIdNameArray),
};

export default backgroundServices;

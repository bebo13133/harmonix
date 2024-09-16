// To be moved to .env file
const baseUrl = 'https://harmonix.emage.co.uk/api';

async function request(method, endpoint, params) {
  const options = {
    method,
    headers: {},
  };

  if (params) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(params);
  }

  try {
    let response = await fetch(baseUrl + endpoint, options);
    let data = null;

    if (response.status !== 204) {
      data = await response.json();
    }

    if (!response.ok) {
      throw new Error(data);
    }

    return data;
  } catch (error) {
    console.error('Error making request:', error.message);
    throw error;
  }
}

export const get = request.bind(null, 'GET');
export const post = request.bind(null, 'POST');

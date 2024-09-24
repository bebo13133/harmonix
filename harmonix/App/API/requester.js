import AsyncStorage from '@react-native-async-storage/async-storage';

async function request(method, endpoint, params, requiresAuth = true) {
  const options = {
    method,
    headers: {},
    credentials: 'include',
  };

  if (params) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(params);
  }

  if (requiresAuth) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 50));
      const token = await AsyncStorage.getItem('auth');
      if (token) {
        const parsedToken = JSON.parse(token);
        options.headers['Authorization'] = `Bearer ${parsedToken.token}`;
      } else {
        console.warn('No token found in AsyncStorage');
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
  }

  try {
    let response = await fetch(endpoint, options);
    let data = null;

    if (response.status !== 204) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    }

    if (!response.ok) {
      throw new Error(typeof data === 'string' ? data : JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Error making request:', error.message);
    throw error;
  }
}

export const get = (endpoint, requiresAuth = true) => request('GET', endpoint, null, requiresAuth);
export const post = (endpoint, params, requiresAuth = true) => request('POST', endpoint, params, requiresAuth);

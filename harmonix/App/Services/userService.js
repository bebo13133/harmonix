import { post } from '../API/requester';

const baseUrl = 'https://harmonix.emage.co.uk/api';

const userService = {
  login: async (email, password) => {
    try {
      const response = await post(`${baseUrl}/login`, { email, password });
      if (response.token) {
        return response;
      } else {
        throw new Error('Error login: Invalid credentials');
      }
    } catch (error) {
      console.error('Error login:', error);
      throw error;
    }
  },

  logout: async () => {},
};

export default userService;

import { post } from "../API/requester";


const userService = {
  login: async (email, password) => {
    try {
      const response = await post('/login', { email, password });
      if (response.token) {
        return response.token;
      } else {
        throw new Error('Error login: Invalid credentials');
      }
    } catch (error) {
      console.error('Error login:', error);
      throw error;
    }
  },

  logout: async () => {
  
  }
};

export default userService;
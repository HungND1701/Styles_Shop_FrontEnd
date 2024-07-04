import api from './api';

export const getUsers = async () => {
  try {
    const response = await api.get('/user');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch user', error);
    throw error;
  }
};
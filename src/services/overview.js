import api from './api';

// Phương thức để lấy danh sách categories
export const getOverview= async () => {
  try {
    const response = await api.get('/overview');
    return response.data;
  } catch (error) {
    throw error;
  }
};
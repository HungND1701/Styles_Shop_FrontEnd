import api from './api';

// Phương thức để lấy danh sách categories
export const getBannersHomepage = async () => {
    try {
      const response = await api.get('/banner-homepages');
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  
  // Phương thức để tạo category mới
  export const createBannersHomepage = async (data) => {
    try {
      const response = await api.post('/banner-homepages', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const getBannerHomepageById = async (id) => {
    try {
      const response = await api.get(`/banner-homepages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const updateBannersHomepage = async (id, data) => {
    try {
      const response = await api.put(`/banner-homepages/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  export const deleteBannersHomepage = async (id) => {
    try {
      const response = await api.delete(`/banner-homepages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
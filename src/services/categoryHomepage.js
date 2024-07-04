import api from './api';

export const getCategoriesHomepage = async () => {
    try {
      const response = await api.get('/category-homepages');
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  export const getCategoriesProductHomepage = async () => {
    try {
      const response = await api.get('/category-product-homepages');
      return response.data;
    } catch (error) {
      throw error;
    }
  };
export const createCategoryHomepage = async (data) => {
    try {
      const response = await api.post('/category-homepages', data);
      return response.data;
    } catch (error) {
      throw error;
    }
};
export const getCategoryHomepageById = async (id) => {
    try {
      const response = await api.get(`/category-homepages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
};
export const updateCategoryHomepage = async (id, data) => {
    try {
      const response = await api.put(`/category-homepages/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
};
export const deleteCategoryHomepage = async (id) => {
    try {
      const response = await api.delete(`/category-homepages/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
};
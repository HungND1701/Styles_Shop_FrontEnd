import api from './api';

export const createReview = async (request) => {
    try {
      const response = await api.post('/reviews', request);
      return response.data;
    } catch (error) {
      throw error;
    }
};

export const getReviewByUserId = async () => {
    try {
      const response = await api.post('/reviews/getByUserId', {});
      return response.data;
    } catch (error) {
      throw error;
    }
};
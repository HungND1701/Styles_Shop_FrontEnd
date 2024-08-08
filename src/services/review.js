import api from './api';

export const createReview = async (request) => {
    try {
      const response = await api.post('/reviews', request);
      return response.data;
    } catch (error) {
      throw error;
    }
};
export const getAllReview = async () => {
  try {
    const response = await api.get('/reviews/all');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteReviewFromAdmin = async (id) => {
  try {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const deleteReviewFromUser = async (id) => {
  try {
    const request = {};
    const response = await api.delete(`/reviews/user/${id}`, request);
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
export const replyReview = async (data, reviewId) => {
  try {
    const response = await api.post('/reviews/reply', {});
    return response.data;
  } catch (error) {
    throw error;
  }
};
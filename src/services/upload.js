import api from './api';


export const uploadImage = async (file) => {
    try {
      // Tạo FormData object để chứa dữ liệu cần gửi
      const formData = new FormData();
      formData.append('file', file);
  
      // Gửi yêu cầu POST đến máy chủ
      const response = await api.post('uploads/store', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  export const deleteFile = async (url) => {
    try {
      const response = await api.post('uploads/destroy', url);
      return response.data;
    } catch (error) {
      console.error('Error delete image:', error);
      throw error;
    }
  };
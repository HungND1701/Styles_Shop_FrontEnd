import api from './api';

export const login = async (email, password) => {
  try {
    const response = await api.post('/login', {
      email,
      password
    });
    sessionStorage.setItem('token', response.data.token);
    sessionStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data; 
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
export const register = async (request) => {
  try {
    const response = await api.post('/register', request);
    return response; // Giả sử response.data chứa token và các thông tin khác
  } catch (error) {
    console.error('Error Register:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/logout', {});
    
    if (response.status === 200) {
      // Xóa token và thông tin người dùng khỏi sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: 'Logout failed' };
    }
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, message: error.message };
  }
};
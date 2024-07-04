import api from './api';

export const getProducts = async () => {
    try {
      const response = await api.get('/product');
      return response.data;
    } catch (error) {
      throw error;
    }
};
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const getAllProduct = async () => {
  try {
    const response = await api.get('/product/getAll');
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const createProduct = async (productData) => {
    try {
      const response = await api.post('/product', productData);
      console.log(response);
      return response.data;
    } catch (error) {
        console.log(error);
      throw error;
    }
};
export const updateProduct = async (id, productData) => {
  try {
    const response = await api.put(`/product/${id}`, productData);
    console.log(response);
    return response;
  } catch (error) {
      console.log(error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await api.delete(`/product/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteImageFromProduct = async (imageColorProductId) => {
  try {
    const response = await api.delete(`/product/image/${imageColorProductId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const roundToThousands = (num) => {
  return Math.round(num / 1000) * 1000;
};
export const formatNumber = (num) => {
  return num.toLocaleString('de-DE'); // Sử dụng 'de-DE' để có định dạng với dấu chấm
};
export const getNewPrice = (price, sale)=>{
  const person = parseInt(sale.replace('%', ''), 10);
  return formatNumber(roundToThousands(price - price*person/100));
}
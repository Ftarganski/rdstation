import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getProducts = async () => {
  try {
    console.log('Fazendo requisição para:', `${baseURL}/products`);
    const response = await axios.get(`${baseURL}/products`);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao obter os produtos:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${baseURL}/products`,
    });
    throw error;
  }
};

export default getProducts;

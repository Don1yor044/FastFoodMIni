import axios from "axios";

export const productsApi = async () => {
  try {
    const res = await axios.get(`https://87b8e98416bbc1eb.mokky.dev/Products`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
productsApi();
export const categoriesApi = async () => {
  try {
    const res = await axios.get(
      `https://87b8e98416bbc1eb.mokky.dev/Categories`
    );
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
categoriesApi();
export const OrdersApi = {
  getOrders: async () => {
    try {
      const res = await axios.get(`https://87b8e98416bbc1eb.mokky.dev/Users`);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createOrder: async (orderData: any) => {
    try {
      const res = await axios.post(
        `https://87b8e98416bbc1eb.mokky.dev/Users`,
        orderData
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

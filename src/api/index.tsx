import axios from "axios";

export const productsApi = async () => {
  try {
    const res = await axios.get(`https://f77d5097a3c8dbfe.mokky.dev/Products`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
productsApi();
export const categoriesApi = async () => {
  try {
    const res = await axios.get(
      `https://f77d5097a3c8dbfe.mokky.dev/Categories`
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
      const res = await axios.get(`https://f77d5097a3c8dbfe.mokky.dev/Orders`);
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  createOrder: async (orderData: any) => {
    try {
      const res = await axios.post(
        `https://f77d5097a3c8dbfe.mokky.dev/Orders`,
        orderData
      );
      return res.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

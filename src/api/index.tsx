import { message } from "antd";
import axios from "axios";

export const productsApi = async () => {
  try {
    const res = await axios.get(`http://75.101.221.235:8080/api/product/get`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
productsApi();
export const categoriesApi = async () => {
  try {
    const res = await axios.get(`http://75.101.221.235:8080/api/category/get`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};
categoriesApi();

export const KoriznkaApi = {
  getKorzinka: async (userId: string) => {
    try {
      const loggedInUser = localStorage.getItem("loggedInUser");

      // Agar foydalanuvchi tizimga kirgan bo'lmasa, bo'sh massiv qaytaring
      if (!loggedInUser) {
        console.log(
          "Foydalanuvchi tizimga kirmagan, bo'sh korzinka qaytaryapti."
        );
        return []; // Bo'sh massiv qaytariladi
      }

      const token = JSON.parse(loggedInUser);

      const res = await axios.get(
        `http://75.101.221.235:8080/api/order/get/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
          },
        }
      );

      const data = res.data;

      if (data.items && data.items.length > 0) {
        console.log(data, "res");
        return data; // Ma'lumot mavjud bo'lsa, uni qaytaradi
      } else {
        console.log("Ma'lumot yo'q");
        return []; // Ma'lumot bo'lmasa, bo'sh massiv qaytariladi
      }
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
      // Xatolikni tashlamang, bo'sh massiv qaytaring
      return []; // Bo'sh massiv qaytariladi
    }
  },

  createKorzinka: async (orderData: any) => {
    try {
      const res = await axios.post(
        `http://75.101.221.235:8080/api/order/create`,
        orderData
      );
      return res.data; // Yaratilgan buyurtma ma'lumotlarini qaytaradi
    } catch (error) {
      console.error(error);
      throw error; // Xatolikni tashlaydi
    }
  },

  updateKorzinka: async (cartId: string, orderData: any) => {
    try {
      const res = await axios.patch(
        `http://75.101.221.235:8080/api/order/update/${cartId}`,
        orderData
      );
      return res.data; // Yangilangan buyurtma ma'lumotlarini qaytaradi
    } catch (error) {
      console.error(error);
      throw error; // Xatolikni tashlaydi
    }
  },
};

export const LoginApi = async (username: string, password: string) => {
  try {
    const res = await axios.post(`http://75.101.221.235:8080/api/auth/token`, {
      username,
      password,
    });
    return res.data;
  } catch (error) {
    console.error(error);
    message.error("Foydalanuvchi topilmadi");
  }
};

export const RegisterApi = async (
  fullname: string,
  username: string,
  phone: string,
  password: string
) => {
  try {
    const res = await axios.post(
      `http://75.101.221.235:8080/api/auth/register`,
      JSON.stringify({
        fullname,
        username,
        phone,
        password,
      })
    );
    return res.data;
  } catch (error) {
    console.error(error);
    message.success("Royxatdan otdiz!");
  }
};

export const UserExistApi = async (username: string) => {
  try {
    const response = await axios.get(
      `http://75.101.221.235:8080/api/user/exist/${username}`
    );
    return response.data;
  } catch (error) {
    console.error("UserExistApi chaqiruvida xatolik:", error);
    throw error; // Xatoni qaytarish
  }
};

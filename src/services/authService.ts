import axios from "axios";
import { API_ENDPOINTS } from "../config/api";

export const authService = {
  login: async (email: string, password: string): Promise<boolean> => {
    const response = await axios.post(`${API_ENDPOINTS.auth}/login`, {
      email,
      password,
    });

    const { success, adminId } = response.data;

    if (success && adminId !== null) {
      localStorage.setItem("adminId", adminId.toString());
    }

    return success;
  },
};

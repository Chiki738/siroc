// src/services/authService.ts
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const authService = {
  login: async (email: string, password: string): Promise<boolean> => {
    const response = await axios.post(`${API_URL}/login`, {
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

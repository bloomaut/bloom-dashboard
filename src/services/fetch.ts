import { EnvironmentApi } from "@/typescript/types/environment.enum";
import { POST } from "@/typescript/types/post.type";
import { UPDATE } from "@/typescript/types/update.type";
import axios from "axios";
const API = "/api";

export const get = async (url: string, api: EnvironmentApi) => {
  try {
    const response = await axios.get(`${API}/${url}`, {
      headers: {
        "X-API": api,
      },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const post = async (url: string, data: POST, api: EnvironmentApi) => {
  try {
    const baseURL = process.env[api];
    if (!baseURL) {
      throw new Error(`Invalid API: ${api}`);
    }
    const response = await axios.post(`${API}/${url}`, data, {
      headers: {
        "X-API": api,
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const update = async (url: string, id: string, api: EnvironmentApi, data?: UPDATE) => {
  try {
    const baseURL = process.env[api];
    if (!baseURL) {
      throw new Error(`Invalid API: ${api}`);
    }
    const response = await axios.put(`${API}/${url}/${id}`, data, {
      headers: {
        "X-API": api,
      },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const remove = async (url: string, id: string, api: EnvironmentApi) => {
  try {
    const baseURL = process.env[api];
    if (!baseURL) {
      throw new Error(`Invalid API: ${api}`);
    }
    const response = await axios.delete(`${API}/${url}/${id}`, {
      headers: {
        "X-API": api,
      },
    });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

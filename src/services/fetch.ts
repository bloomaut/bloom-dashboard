import { POST } from "@/typescript/types/post.type";
import { UPDATE } from "@/typescript/types/update.type";
import axios from "axios";
const API = "/api";

export const get = async (url: string, api: "NEXT_PUBLIC_API_DASH" | "NEXT_PUBLIC_API_BOX") => {
  try {
    const response = await axios.get(`${API}/${url}`, {
      headers: {
        "X-Api": api,
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

export const post = async (url: string, data: POST, api: "NEXT_PUBLIC_API_DASH" | "NEXT_PUBLIC_API_UITOOL") => {
  try {
    const baseURL = process.env[api];
    if (!baseURL) {
      throw new Error(`Invalid API: ${api}`);
    }
    const response = await axios.post(`${baseURL}/${url}`, data);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const update = async (
  url: string,
  id: string,
  api: "NEXT_PUBLIC_API_DASH" | "NEXT_PUBLIC_API_UITOOL",
  data?: UPDATE,
) => {
  try {
    const baseURL = process.env[api];
    if (!baseURL) {
      throw new Error(`Invalid API: ${api}`);
    }
    const response = await axios.put(`${baseURL}/${url}/${id}`, data);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const remove = async (url: string, id: string, api: "NEXT_PUBLIC_API_DASH" | "NEXT_PUBLIC_API_UITOOL") => {
  try {
    const baseURL = process.env[api];
    if (!baseURL) {
      throw new Error(`Invalid API: ${api}`);
    }
    const response = await axios.delete(`${baseURL}/${url}/${id}`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

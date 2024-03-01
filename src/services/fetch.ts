import { POST } from "@/typescript/types/post.type";
import { UPDATE } from "@/typescript/types/update.type";
import axios from "axios";
const API = "/api";

export const get = async (url: string) => {
  try {
    const response = await axios.get(`${API}/${url}`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      error;
    }
  }
};

export const post = async (url: string, data: POST) => {
  try {
    const response = await axios.post(`${API}/${url}`, data);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      error;
    }
  }
};

export const update = async (url: string, id: string, data?: UPDATE) => {
  try {
    const response = await axios.put(`${API}/${url}/${id}`, data);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      error;
    }
  }
};

export const remove = async (url: string, id: string) => {
  try {
    const response = await axios.delete(`${API}/${url}/${id}`);
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      error;
    }
  }
};

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

export const postFile = async (url: string, file: File, api: EnvironmentApi) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API}/${url}`, {
      method: "POST",
      body: formData,
      headers: {
        "X-API": api,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const update = async (url: string, api: EnvironmentApi, data?: any, id?: string) => {
  try {
    let endpoint = `${API}/${url}`;
    if (id) {
      endpoint += `/${id}`;
    }

    const response = await axios.put(endpoint, data, {
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

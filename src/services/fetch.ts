import { POST } from "@/typescript/types/post.type";
import { UPDATE } from "@/typescript/types/update.type";
import { EnvironmentApi } from "@/typescript/types/api";
import axios from "axios";
const API = "/api";

export const get = async (url: string, api?: EnvironmentApi) => {
  try {
    const headers: { [key: string]: string | undefined } = {};

    if (api) headers["X-API"] = api;

    const response = await axios.get(`${API}/${url}`, {
      headers: headers,
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

export const getExcel = async (id: string) => {
  try {
    const response = await fetch(`/api/getExcel`, {
      headers: {
        "X-ID": id,
      },
    });
    const pdfBlob = await response?.blob();
    const tempURL = URL.createObjectURL(pdfBlob as Blob);
    window.open(tempURL, "_blank");
    URL.revokeObjectURL(tempURL);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const post = async (url: string, data: POST, api?: EnvironmentApi) => {
  try {
    const headers: { [key: string]: string | undefined } = {};
    if (api) headers["X-API"] = api;

    const response = await axios.post(`${API}/${url}`, data, { headers });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const postFile = async (url: string, file: File, api?: EnvironmentApi) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const headers = new Headers();
    if (api) headers.append("X-API", api);

    const response = await fetch(`${API}/${url}`, {
      method: "POST",
      headers,
      body: formData,
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
};
export const putFile = async (url: string, file: File, api?: EnvironmentApi) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const headers = new Headers();
    if (api) headers.append("X-API", api);

    const response = await fetch(`${API}/${url}`, {
      method: "PUT",
      headers,
      body: formData,
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const update = async (url: string, data: UPDATE, id?: string, api?: EnvironmentApi) => {
  try {
    let endpoint = `${API}/${url}`;
    if (id) {
      endpoint += `/${id}`;
    }

    const headers: { [key: string]: string | undefined } = {};
    if (api) headers["X-API"] = api;

    const response = await axios.put(endpoint, data, { headers });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const remove = async (url: string, id: string, api?: EnvironmentApi) => {
  try {
    const headers: { [key: string]: string | undefined } = {};
    if (api) headers["X-API"] = api;

    const response = await axios.delete(`${API}/${url}/${id}`, { headers });
    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

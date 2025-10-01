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
export const getExcelCatalog = async (id: string, type: string, path: string) => {
  try {
    if (id) {
      const response = await fetch(`/api/${path}`, {
        method: "GET",
        headers: {
          "X-ID": id,
          "type-download": type,
        },
      });
      const pdfBlob = await response?.blob();
      const tempURL = URL.createObjectURL(pdfBlob as Blob);
      window.open(tempURL, "_blank");
      URL.revokeObjectURL(tempURL);
    }
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

export const postExcel = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`/api/generator-ai`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const postQuest = async (questData: {
  userId: string;
  answers: {
    block: string;
    questions: { id: string; answer: string }[];
  }[];
  terms: boolean;
  completed: boolean;
  prop: boolean;
}) => {
  try {
    const response = await fetch(`/api/quest`, {
      method: "POST",
      body: JSON.stringify(questData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const getQuest = async (userId: number) => {
  try {
    const response = await fetch(`/api/quest/${userId}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Request failed:", error);
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

export const postProp = async (questData: {
  blocks: {
    block: string;
    clientId: string;
    questions: {
      id: string;
      answer: string;
    }[];
  }[];
}) => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_DASH}/api/pipeline/interview/block`, questData);

    if (response.status === 400) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const responseData = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};
/* 
export const postProp2 = async () => {
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_DASH}/api/pipeline/onboarding`);
    console.log("response", response);
    if (response.status === 400) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const responseData = response.data;
    return responseData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
}; */

export const postOnboarding = async () => {
  try {
    const response = await axios.post("/api/post-onboarding");

    if (response.status === 400) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const approveProposal = async () => {
  try {
    const response = await axios.post("/api/quest/approve");

    if (response.status === 400) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const getMetas = async () => {
  try {
    const response = await axios.get("/api/pipeline/goals");

    if (response.status === 400) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const getFinances = async () => {
  try {
    const response = await axios.get("/api/finances");

    if (response.status === 400) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

export const createTransaction = async (data: {
  amount: number;
  type: string;
  category: string;
  description: string;
  date: string;
}) => {
  try {
    const response = await axios.post("/api/finances", data);

    if (response.status === 400) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw error;
    }
  }
};

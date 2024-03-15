import { EnvironmentApi } from "@/typescript/types/environment.enum";
import { POST } from "@/typescript/types/post.type";
import { UPDATE } from "@/typescript/types/update.type";
const API = "/api";

export const get = async (url: string, api: EnvironmentApi) => {
  try {
    const response = await fetch(`${API}/${url}`, {
      headers: {
        "X-API": api,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
};

export const post = async (url: string, data: POST, api: EnvironmentApi) => {
  try {
    const response = await fetch(`${API}/${url}`, {
      method: "POST",
      body: data,
      headers: {
        "X-API": api,
      },
    });
    return response;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

export const postFile = async (url: string, file: File | File[], api: EnvironmentApi) => {
  try {
    const formData = new FormData();
    if (file instanceof File) {
      formData.append("file", file);
    } else {
      console.log(file);
      file.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
    }

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

export const update = async (url: string, data: UPDATE, api: EnvironmentApi) => {
  try {
    const response = await fetch(`${API}/${url}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        "X-API": api,
      },
    });
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error en la solicitud:", error);
    throw error;
  }
};

// export const remove = async (url: string, id: string, api: EnvironmentApi) => {
//   try {
//     const response = await fetch(`${API}/${url}`, {
//       method: "PUT",
//       body: JSON.stringify(data),
//       headers: {
//         "Content-Type": "application/json",
//         "X-API": api,
//       },
//     });
//     const json = await response.json();
//     return json;
//   } catch (error) {
//     console.error("Error en la solicitud:", error);
//     throw error;
//   }
// };

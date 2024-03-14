import { POST } from "@/typescript/types/post.type";
import { UPDATE } from "@/typescript/types/update.type";
const API = "/api";

export const get = async (url: string, api: "NEXT_PUBLIC_API_DASH" | "NEXT_PUBLIC_API_UITOOL") => {
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

export const postFile = async (url: string, file: File, api: "NEXT_PUBLIC_API_DASH" | "NEXT_PUBLIC_API_UITOOL") => {
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
    throw error; // Re-lanzar el error para que el componente pueda manejarlo
  }
};

// export const update = async (
//   url: string,
//   id: string,
//   api: "NEXT_PUBLIC_API_DASH" | "NEXT_PUBLIC_API_UITOOL",
//   data?: UPDATE,
// ) => {
//   try {
//     const baseURL = process.env[api];
//     if (!baseURL) {
//       throw new Error(`Invalid API: ${api}`);
//     }
//     const response = await axios.put(`${API}/${url}/${id}`, data, {
//       headers: {
//         "X-API": api,
//       },
//     });
//     return response.data.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       return error.response;
//     } else {
//       throw error;
//     }
//   }
// };

// export const remove = async (url: string, id: string, api: "NEXT_PUBLIC_API_DASH" | "NEXT_PUBLIC_API_UITOOL") => {
//   try {
//     const baseURL = process.env[api];
//     if (!baseURL) {
//       throw new Error(`Invalid API: ${api}`);
//     }
//     const response = await axios.delete(`${API}/${url}/${id}`, {
//       headers: {
//         "X-API": api,
//       },
//     });
//     return response.data.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       return error.response;
//     } else {
//       throw error;
//     }
//   }
// };

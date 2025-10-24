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
    console.log("ERROR", response);
    return response.data.data;
  } catch (error) {
    console.log("ERROR-2", error);
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
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_DASH}/api/pipeline/interview/block`, questData, {
      timeout: 30000, // 30 segundos de timeout
    });

    // Verificar que la respuesta sea exitosa
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    const responseData = response.data;

    // Verificar si la respuesta contiene un error explícito
    if (responseData?.error) {
      throw new Error(
        typeof responseData.error === "string" ? responseData.error : "Error en la respuesta del servidor",
      );
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Request failed postProp:", error);

    // Log detallado para debugging
    if (axios.isAxiosError(error)) {
      console.error("Axios Error Details:", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        responseHeaders: error.response?.headers,
        requestUrl: error.config?.url,
        requestMethod: error.config?.method,
        requestData: error.config?.data,
        requestHeaders: error.config?.headers,
      });
    } else {
      console.error("Non-Axios Error:", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        type: typeof error,
        error: error,
      });
    }

    if (axios.isAxiosError(error)) {
      // Errores de red o timeout
      if (error.code === "ECONNABORTED") {
        return {
          success: false,
          error: "La solicitud tardó demasiado tiempo. Por favor, intenta nuevamente.",
        };
      }

      // Errores de respuesta del servidor
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data?.error || error.message;

        switch (status) {
          case 400:
            return {
              success: false,
              error: `Datos inválidos: ${errorMessage}`,
            };
          case 401:
            return {
              success: false,
              error: "No tienes autorización para realizar esta acción. Por favor, inicia sesión nuevamente.",
            };
          case 403:
            return {
              success: false,
              error: "No tienes permisos para realizar esta acción.",
            };
          case 404:
            return {
              success: false,
              error: "El servicio no está disponible en este momento.",
            };
          case 429:
            return {
              success: false,
              error: "Demasiadas solicitudes. Por favor, espera un momento antes de intentar nuevamente.",
            };
          case 500:
          case 502:
          case 503:
          case 504:
            return {
              success: false,
              error: "Error interno del servidor. Por favor, intenta nuevamente en unos minutos.",
            };
          default:
            return {
              success: false,
              error: `Error del servidor (${status}): ${errorMessage}`,
            };
        }
      }

      // Errores de red sin respuesta
      return {
        success: false,
        error: "Error de conexión. Verifica tu conexión a internet e intenta nuevamente.",
      };
    }

    // Otros tipos de errores
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado al procesar tu solicitud.",
    };
  }
};

export const postOnboarding = async () => {
  try {
    const response = await axios.post(
      "/api/post-onboarding",
      {},
      {
        timeout: 30000, // 30 segundos de timeout
      },
    );

    // Verificar que la respuesta sea exitosa
    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    const responseData = response.data;

    // Verificar si la respuesta contiene un error explícito
    if (responseData?.error) {
      throw new Error(
        typeof responseData.error === "string" ? responseData.error : "Error en la respuesta del servidor",
      );
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error("Request failed postOnboarding:", error);

    if (axios.isAxiosError(error)) {
      // Errores de red o timeout
      if (error.code === "ECONNABORTED") {
        return {
          success: false,
          error: "La notificación tardó demasiado tiempo. Por favor, intenta nuevamente.",
        };
      }

      // Errores de respuesta del servidor
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message || error.response.data?.error || error.message;

        switch (status) {
          case 400:
            return {
              success: false,
              error: `Error en la notificación: ${errorMessage}`,
            };
          case 401:
            return {
              success: false,
              error: "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.",
            };
          case 403:
            return {
              success: false,
              error: "No tienes permisos para completar el onboarding.",
            };
          case 404:
            return {
              success: false,
              error: "El servicio de onboarding no está disponible.",
            };
          case 429:
            return {
              success: false,
              error: "Demasiadas solicitudes. Por favor, espera un momento.",
            };
          case 500:
          case 502:
          case 503:
          case 504:
            return {
              success: false,
              error: "Error del servidor al procesar el onboarding. Intenta nuevamente en unos minutos.",
            };
          default:
            return {
              success: false,
              error: `Error del servidor (${status}): ${errorMessage}`,
            };
        }
      }

      // Errores de red sin respuesta
      return {
        success: false,
        error: "Error de conexión al notificar el progreso. Verifica tu conexión a internet.",
      };
    }

    // Otros tipos de errores
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error inesperado al notificar el progreso.",
    };
  }
};

export const approveProposal = async () => {
  try {
    // Cambiar de POST a PUT
    const response = await axios.put("/api/quest/approve");

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

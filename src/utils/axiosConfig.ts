import axios from "axios";

// Configuración del interceptor para agregar el client_id desde localStorage
axios.interceptors.request.use(config => {
  const clientId = localStorage.getItem("client_id");
  if (clientId) {
    config.headers["X-Client-ID"] = clientId;
  }
  return config;
});

export default axios;

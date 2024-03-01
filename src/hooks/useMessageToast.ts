import { toast } from "react-toastify";
import "@/styles/globals.scss";

export const useMessageToast = () => {
  const notify = (message: string) => {
    toast(`✔️ ${message}`, {
      bodyClassName: "toastUpdateBody",
      className: "toastOk",
      toastId: "customId",
    });
  };
  const notifyError = (message: string) => {
    toast(`❌ ${message}`, {
      bodyClassName: "toastUpdateBody",
      className: "toastBad",
      toastId: "customIdError",
    });
  };

  return {
    notify,
    notifyError,
  };
};

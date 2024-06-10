import { post, remove } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";

export const handleBotAction = async (
  action: "train" | "clean",
  url: string,
  method: "post" | "remove",
  successMessage: string,
  errorMessage: string,
  setLoading: (loading: boolean) => void,
  notify: (message: string) => void,
  notifyError: (message: string) => void,
  closePopup: (value: boolean) => void,
) => {
  setLoading(true);
  let response;

  if (method === "post") {
    response = await post(url, "", ENV.BOX);
  } else {
    response = await remove(url, "", ENV.BOX);
  }

  if (response.statusCode === 200 || (response.data && response.data.statusCode === 200)) {
    closePopup(false);
    notify(successMessage);
  } else {
    notifyError(errorMessage);
  }

  setLoading(false);
};

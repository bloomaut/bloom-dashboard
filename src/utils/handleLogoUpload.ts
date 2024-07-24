import { putFile } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { ENV } from "@/typescript/types/api";

export const handleLogoUpload = async (file: File | null) => {
  const { notifyError } = useMessageToast();

  if (file) {
    const response = await putFile("small-business/logo", file, ENV.DASHBOARD);
    if (response.data.statusCode === 200) {
      const { colors, url } = response.data.result.data;
      return { colors, url };
    } else {
      notifyError("Error uploading file");
      return null;
    }
  }
};

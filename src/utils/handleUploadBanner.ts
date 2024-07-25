import { putFile } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";
import { ENV } from "@/typescript/types/api";

export const handleLogoBanner = async (file: File | null) => {
  const { notifyError } = useMessageToast();

  if (file) {
    const response = await putFile("small-business/banner", file, ENV.DASHBOARD);
    if (response.data.statusCode === 200) {
      const url = response.data.result.data.client.banner;
      return url;
    } else {
      notifyError("Error uploading file");
      return null;
    }
  }
};

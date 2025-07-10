import { putFile } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";

export async function handleLogoUpload(file: File, notify: (msg: string) => void, notifyError: (msg: string) => void) {
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
}

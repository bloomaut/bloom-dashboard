import { putFile } from "@/services/fetch";
import { ENV } from "@/typescript/types/api";

export async function handleLogoBanner(file: File, notify: (msg: string) => void, notifyError: (msg: string) => void) {
  if (file) {
    const response = await putFile("small-business/banner", file, ENV.DASHBOARD);
    if (response.data.statusCode === 200) {
      const url = response.data.result.data.client.banner;
      notify("File uploaded successfully");
      return url;
    } else {
      notifyError("Error uploading file");
      return null;
    }
  }
}

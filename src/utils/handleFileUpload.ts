import { postFile } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";

export function useHandleFileUpload() {
  const { notify, notifyError } = useMessageToast();
  return async function handleFileUpload(file: File | null) {
    if (file) {
      const response = await postFile("small-files/media", file);
      if (response.data.statusCode === 201) {
        const imageUrl = response.data.result.media.url;
        return imageUrl;
      } else {
        notifyError("Error uploading file");
        return null;
      }
    }
  };
}

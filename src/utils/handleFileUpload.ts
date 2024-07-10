import { postFile } from "@/services/fetch";
import { useMessageToast } from "@/hooks/useMessageToast";

export const handleFileUpload = async (file: File | null) => {
  const { notifyError } = useMessageToast();

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

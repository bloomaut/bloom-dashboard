import { Dispatch, SetStateAction } from "react";
import ImageDropzone from "./ImageDropzone";
import ImageZone from "./ImageZone";

interface FileDragDropProps {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  type: "excel" | "image" | "pdf";
  currentImage?: string | null;
  name?: string | null;
  variableName?: string | null;
  setVariableName?: Dispatch<SetStateAction<string | null>> | null;
}

const DragImage = ({ file, setFile, currentImage, name, variableName, setVariableName }: FileDragDropProps) => {
  return (
    <ImageZone
      file={file}
      setFile={setFile}
      currentImage={currentImage || null}
      name={name}
      variableName={variableName}
      setVariableName={setVariableName || null}
    />
  );
};

export default DragImage;

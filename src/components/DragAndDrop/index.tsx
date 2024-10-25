import { Dispatch, SetStateAction } from "react";
import ExcelDropzone from "./ExcelDropzone";
import PdfDropzone from "./PdfDropzone";
import ImageDropzone from "./ImageDropzone";

interface FileDragDropProps {
  file: File | null;
  setFile: Dispatch<SetStateAction<File | null>>;
  type: "excel" | "image" | "pdf";
  currentImage?: string | null;
  name?: string | null;
  variableName?: string | null;
  setVariableName?: Dispatch<SetStateAction<string | null>> | null;
}

const DragAndDrop = ({ file, setFile, type, currentImage, name, variableName, setVariableName }: FileDragDropProps) => {
  if (type === "excel") {
    return <ExcelDropzone file={file} setFile={setFile} />;
  } else if (type === "image") {
    return (
      <ImageDropzone
        file={file}
        setFile={setFile}
        currentImage={currentImage || null}
        name={name}
        variableName={variableName}
        setVariableName={setVariableName || null}
      />
    );
  } else if (type === "pdf") {
    return <PdfDropzone file={file} setFile={setFile} />;
  } else {
    return null;
  }
};

export default DragAndDrop;

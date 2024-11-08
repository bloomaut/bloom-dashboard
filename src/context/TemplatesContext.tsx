import { get } from "@/services/fetch";
import { useAppSelector } from "@/store/hooks";
import { Template } from "@/typescript/interfaces/template.interface";
import { ENV } from "@/typescript/types/api";
import { createContext, useContext, useEffect, useState } from "react";

interface TemplateContext {
  templates: Template[];
  loading: boolean;
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  previewId: string;
  setPreviewId: (id: string) => void;
  previewLoading: boolean;
  setPreviewLoading: (loading: boolean) => void;
}

const TemplateContext = createContext<TemplateContext>({
  templates: [],
  loading: true,
  selectedTemplateId: "",
  setSelectedTemplateId: () => "",
  previewId: "",
  setPreviewId: () => "",
  previewLoading: false,
  setPreviewLoading: () => false,
});

export const TemplateProvider = ({ children }: { children: JSX.Element }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [previewId, setPreviewId] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const { clientId } = useAppSelector(state => state.ricardosData);

  const fetchDataHotlink = async () => {
    const response = await get("skinx-generator/category", ENV.TOOL);
    if (response.statusCode === 200) {
      setTemplates(response.result.templates);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataHotlink();

    if (selectedTemplateId) {
      window.localStorage.setItem("selectedTemplateId", selectedTemplateId);
    }
  }, [selectedTemplateId, clientId]);

  return (
    <TemplateContext.Provider
      value={{
        templates,
        loading,
        selectedTemplateId,
        setSelectedTemplateId,
        previewId,
        setPreviewId,
        previewLoading,
        setPreviewLoading,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplateContext = () => useContext(TemplateContext);

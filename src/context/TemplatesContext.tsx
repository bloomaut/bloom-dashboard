import { get } from "@/services/fetch";
import { useAppSelector } from "@/store/hooks";
import { Template } from "@/typescript/interfaces/template.interface";
import { ENV } from "@/typescript/types/api";
import { createContext, useContext, useEffect, useState } from "react";

interface TemplateContext {
  templates: Template[];
  loading: boolean;
  previewId: string;
  setPreviewId: (id: string) => void;
  previewLoading: boolean;
  setPreviewLoading: (loading: boolean) => void;
}

const TemplateContext = createContext<TemplateContext>({
  templates: [],
  loading: true,
  previewId: "",
  setPreviewId: () => "",
  previewLoading: false,
  setPreviewLoading: () => false,
});

export const TemplateProvider = ({ children }: { children: JSX.Element }) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
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
  }, [clientId]);

  return (
    <TemplateContext.Provider
      value={{
        templates,
        loading,
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

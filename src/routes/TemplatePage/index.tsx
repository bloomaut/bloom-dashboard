import { TemplateProvider } from "@/context/TemplatesContext";
import TemplatesPage from "./templatePage";

const Templates = () => {
  return (
    <TemplateProvider>
      <TemplatesPage />
    </TemplateProvider>
  );
};

export default Templates;

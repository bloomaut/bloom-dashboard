"use client";
import { DesignProvider } from "@/context/DesignContext";
import CreateDesignPage from "./createDesign";

const CreateDesign = () => {
  return (
    <DesignProvider>
      <CreateDesignPage />
    </DesignProvider>
  );
};

export default CreateDesign;

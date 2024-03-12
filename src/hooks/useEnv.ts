import { useEffect } from "react";
import dotenv from "dotenv";

const useEnv = (envFile: string = ".env.local"): void => {
  useEffect(() => {
    dotenv.config({ path: envFile });
  }, [envFile]);
};

export default useEnv;

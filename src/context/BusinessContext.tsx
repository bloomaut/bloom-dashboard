import { useMessageToast } from "@/hooks/useMessageToast";
import { get } from "@/services/fetch";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
import { useTranslations } from "next-intl";
import { createContext, useContext, useEffect, useState } from "react";

interface ContextTypes {
  userData: null | UserBusiness;
  loading: boolean;
}

const BusinessContext = createContext<ContextTypes>({
  userData: null,
  loading: true,
});

export const BusinessProvider = ({ children }: { children: JSX.Element }) => {
  const dict = useTranslations("dict.toast");
  const { notifyError } = useMessageToast();
  const [userData, setuserData] = useState<null | UserBusiness>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      const res = await get("user/me");
      if (res.statusCode === 200) {
        setuserData(res.result.user);
      } else {
        notifyError(dict("error_tryagain"));
      }
      console.log(res);
      setLoading(false);
    };

    getUserData();
  }, []);

  return (
    <BusinessContext.Provider
      value={{
        userData,
        loading,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessContext = () => useContext(BusinessContext);

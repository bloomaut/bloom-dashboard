import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { get } from "@/services/fetch";
import { useAppSelector } from "@/store/hooks";
import { FAQ } from "@/typescript/interfaces/faq.interface";
import { ENV } from "@/typescript/types/api";

interface Context {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  faqs: FAQ[];
  setFaqs: Dispatch<SetStateAction<FAQ[]>>;
}

const FAQContext = createContext<Context>({
  loading: false,
  setLoading: () => undefined,
  faqs: [],
  setFaqs: () => undefined,
});

export const FAQProvider = ({ children }: { children: JSX.Element }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const { clientId } = useAppSelector(state => state.ricardosData);

  const getFaqs = async () => {
    const data = await get(`small-faq`, ENV.BOX);
    if (data.statusCode === 200) {
      console.log(data.result);
      setFaqs(data.result.smallFAQs);
    }
    setLoading(false);
  };

  useEffect(() => {
    getFaqs();
  }, [clientId]);

  return (
    <FAQContext.Provider
      value={{
        loading,
        setLoading,
        faqs,
        setFaqs,
      }}
    >
      {children}
    </FAQContext.Provider>
  );
};

export const useFAQContext = () => useContext(FAQContext);

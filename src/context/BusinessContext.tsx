import useFormValidator from "@/hooks/useFormValidator";
import { useMessageToast } from "@/hooks/useMessageToast";
import { userInitialState } from "@/store/features/userSlice";
import { UserBusiness } from "@/typescript/interfaces/business.interface";
import { ChangeEvent, createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useLocale, useTranslations } from "next-intl";
import { handleLogoUpload } from "@/utils/handleLogoUpload";
import { update } from "@/services/fetch";
import { setUserData } from "@/store/features/userSlice";
import { handleLogoBanner } from "@/utils/handleUploadBanner";
import { useRouter } from "next/navigation";
import { setDataSubdomains } from "@/store/features/subdomainsSlice";

const initialFormData: UserBusiness = {
  name: "",
  lastname: "",
  client: {
    name: "",
    description: "",
    category: "",
    logo: "",
    banner: "",
    palette: [],
    company_web: "",
    instagram: "",
    facebook: "",
    tiktok: "",
    address: "",
  },
  founded: 0,
  employees: 0,
  phone: "",
  subdomain: "",
};

interface BusinessContextType {
  formData: UserBusiness;
  setFormData: React.Dispatch<React.SetStateAction<UserBusiness>>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: () => void;
  handleCategoryChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  checkValidation: boolean;
  errors: Record<string, string>;
  logo: File | null;
  setLogo: React.Dispatch<React.SetStateAction<File | null>>;
  errorLogo: boolean;
  banner: File | null;
  setBanner: React.Dispatch<React.SetStateAction<File | null>>;
  loading: boolean;
}

const BusinessContext = createContext<BusinessContextType>({
  formData: initialFormData,
  setFormData: () => {
    throw new Error("setFormData function not implemented");
  },
  handleChange: () => {
    throw new Error("handleChange function not implemented");
  },
  handleSubmit: () => {
    throw new Error("handleSubmit function not implemented");
  },
  handleCategoryChange: () => {
    throw new Error("handleCategoryChange function not implemented");
  },
  checkValidation: false,
  errors: {},
  logo: null,
  setLogo: () => {
    throw new Error("setLogo function not implemented");
  },
  errorLogo: false,
  banner: null,
  setBanner: () => {
    throw new Error("setBanner function not implemented");
  },
  loading: false,
});

interface BusinessProviderProps {
  children: ReactNode;
}

export const BusinessProvider = ({ children }: BusinessProviderProps) => {
  const [checkValidation, setCheckValidation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [errorLogo, setErrorLogo] = useState(false);
  const [formData, setFormData] = useState<UserBusiness>(userInitialState);
  const fieldsToValidate = ["name", "lastname", "business_name", "business_category", "business_description", "logo"];
  const errors = useFormValidator(formData, fieldsToValidate);
  const userData = useAppSelector(state => state.userData);
  const subdomainsData = useAppSelector(state => state.subdomainsData);
  const [alreadyHadSubdomain, setHadSubdomain] = useState<string | null | undefined>(null);
  const dispatch = useAppDispatch();
  const dict = useTranslations("dict");
  const router = useRouter();
  const locale = useLocale();
  const { notify, notifyError } = useMessageToast();

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      client: {
        ...prevFormData.client,
        category: e.target.value,
      },
    }));
  };

  const validateLogo = () => Boolean(logo || formData.client.logo);

  // Inicializar el form con los datos que llegan de la API o mostrarlo vacío
  useEffect(() => {
    setFormData(userData.name !== "" ? userData : initialFormData);
    if (subdomainsData.subdomains.length > 0) {
      setFormData(prevFormData => ({
        ...prevFormData,
        subdomain: subdomainsData.subdomains[0].subdomain,
      }));
      setHadSubdomain(subdomainsData.subdomains[0].subdomain);
    }
  }, [userData, subdomainsData]);

  // Si el logo existe, agregarlo al FormData
  useEffect(() => {
    const uploadLogo = async () => {
      if (logo) {
        const data = await handleLogoUpload(logo, notify, notifyError);
        const logoURL = data?.url || "";
        const colors = data?.colors || [];
        const parsedPalette = colors.map((color: string) => ({ color }));

        setFormData(prevFormData => ({
          ...prevFormData,
          client: {
            ...prevFormData.client,
            logo: logoURL,
            palette: parsedPalette,
          },
        }));
      }
      setErrorLogo(false);
    };

    uploadLogo();
  }, [logo]);

  // Si el banner existe, agregarlo al FormData
  useEffect(() => {
    const uploadBanner = async () => {
      if (banner) {
        const bannerUrl = await handleLogoBanner(banner, notify, notifyError);
        setFormData(prevFormData => ({
          ...prevFormData,
          client: {
            ...prevFormData.client,
            banner: bannerUrl,
          },
        }));
      }
    };

    uploadBanner();
  }, [banner]);

  const handleSubmit = async () => {
    setCheckValidation(true);

    // Chequear errores
    if (Object.keys(errors).length === 0 && validateLogo()) {
      setLoading(true);
      setCheckValidation(false);
      setErrorLogo(false);

      const dataToSend = {
        userName: formData.name,
        userLastname: formData.lastname,
        clientName: formData.client.name,
        category: formData.client.category,
        description: formData.client.description,
        website: formData.client.company_web,
        instagram: formData.client.instagram,
        facebook: formData.client.facebook,
        tiktok: formData.client.tiktok,
        phone: formData.phone,
        subdomain: formData.subdomain,
        address: formData.client.address,
        logo: formData.client.logo,
        palette: formData.client.palette,
      };

      const response = await update("small-business", dataToSend);
      if (response.statusCode === 200) {
        notify(dict("toast.success_edit"));
        setLoading(false);
        dispatch(
          setUserData({
            name: dataToSend.userName,
            lastname: dataToSend.userLastname,
            client: {
              name: dataToSend.clientName,
              category: dataToSend.category,
              description: dataToSend.description,
              logo: dataToSend.logo,
              banner: formData.client.banner,
              palette: dataToSend.palette,
              company_web: dataToSend.website,
              instagram: dataToSend.instagram,
              facebook: dataToSend.facebook,
              tiktok: dataToSend.tiktok,
              address: dataToSend.address,
            },
            phone: dataToSend.phone,
            subdomain: dataToSend.subdomain,
          }),
        );
        setHadSubdomain(dataToSend.subdomain);
        if (response.result.landingEngine) {
          dispatch(setDataSubdomains([response.result.landingEngine])); // landingEngine = subdomain
        }
        router.push(`/${locale}/my-business`);
      } else {
        notifyError(dict("toast.error_edit"));
        setLoading(false);
      }
    } else {
      setErrorLogo(!validateLogo());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => {
      if (name.startsWith("business_")) {
        const clientField = name.replace("business_", "");
        return {
          ...prevFormData,
          client: {
            ...prevFormData.client,
            [clientField]: value,
          },
        };
      }
      return {
        ...prevFormData,
        [name]: value,
      };
    });
    if (name === "business_name" && !alreadyHadSubdomain) {
      setFormData(prevFormData => ({
        ...prevFormData,
        subdomain: value
          .trim()
          .toLowerCase()
          .replaceAll(" ", "-")
          .replace(/[^\w\s]/gi, ""),
      }));
    }
  };

  return (
    <BusinessContext.Provider
      value={{
        formData,
        logo,
        setLogo,
        errorLogo,
        banner,
        setBanner,
        loading,
        setFormData,
        handleChange,
        handleSubmit,
        checkValidation,
        handleCategoryChange,
        errors,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessContext = () => useContext(BusinessContext);

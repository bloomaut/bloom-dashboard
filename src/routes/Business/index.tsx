import MainBusiness from "./business";
import { BusinessProvider } from "@/context/BusinessContext";

const Business = () => {
  return (
    <BusinessProvider>
      <MainBusiness />
    </BusinessProvider>
  );
};

export default Business;

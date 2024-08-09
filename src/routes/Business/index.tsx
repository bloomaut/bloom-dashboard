import Business from "./Business";
import { BusinessProvider } from "@/context/BusinessContext";

const BusinessPage = () => {
  return (
    <BusinessProvider>
      <Business />
    </BusinessProvider>
  );
};

export default BusinessPage;

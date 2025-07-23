import { BusinessDashboard } from "@/components/v0Components/business-dashboard";
import Business from "./Business";
import { BusinessProvider } from "@/context/BusinessContext";

const BusinessPage = () => {
  return (
    <BusinessProvider>
      <BusinessDashboard />
    </BusinessProvider>
  );
};

export default BusinessPage;

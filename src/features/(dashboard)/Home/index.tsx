import { BusinessDashboard } from "./components/BusinessDashboard";
import { BusinessProvider } from "@/features/(dashboard)/Home/context/BusinessContext";

const HomePage = () => {
  return (
    <BusinessProvider>
      <BusinessDashboard />
    </BusinessProvider>
  );
};

export default HomePage;

import { ClientsProvider, useClientsContext } from "@/context/ClientsContext";
import Form from "./Form";
import Select from "./Select";
import styles from "./styles.module.scss";
import Title from "@/components/Title";
import { useEffect } from "react";
import { FlakesProvider } from "@/context/FlakesContext";

const HotlinksPage = () => {
  const { fetchClients } = useClientsContext();

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <FlakesProvider>
      <ClientsProvider>
        <section className={styles.container}>
          <Title text='Generación Hotlink' />
          <div className={styles.inner_container}>
            <Select />
            <Form />
          </div>
        </section>
      </ClientsProvider>
    </FlakesProvider>
  );
};

export default HotlinksPage;

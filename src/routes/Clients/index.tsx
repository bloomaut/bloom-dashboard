import styles from "./styles.module.scss";
import { ChangeEvent, useEffect, useState } from "react";
import Title from "@/components/Title";
import Input from "@/components/Input";
import { get } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setClientsData } from "@/store/features/clients";

const ClientsPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const clients = useAppSelector(state => state.clients);
  const dispatch = useAppDispatch();

  const fetchData = async () => {
    try {
      const data = await get("client-customer", ENV.DASH);
      dispatch(setClientsData(data.result.data));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(e.target.value);
  };

  return (
    <section className={styles.container}>
      <Title text='Cartera de Clientes' />
      <Input
        textHolder='Buscar cliente'
        type='text'
        name='search'
        value={searchValue}
        handleChange={handleSearchChange}
        className='search'
        iconSearch
      />
      {loading ? (
        <p>Cargando clientes...</p>
      ) : clients.length > 0 ? (
        <ul>
          {clients.map(client => (
            <li key={client._id}>{client.ClientFirstname}</li>
          ))}
        </ul>
      ) : (
        <p>No hay clientes disponibles</p>
      )}
    </section>
  );
};

export default ClientsPage;

"use client";
import styles from "./styles.module.scss";
import { ChangeEvent, useEffect, useState } from "react";
import Title from "@/components/Title";
import Input from "@/components/Input";
import Button from "@/components/Button";
import Row from "./Row";
import LoadingSpinner from "@/components/Loading";
import { get } from "@/services/fetch";
import { ENV } from "@/typescript/types/environment.enum";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setClientsData } from "@/store/features/clients";
import addIcon from "../../../public/icons/add.svg";
import FormCreate from "./FormCreate";

const ClientsPage = () => {
  const [searchValue, setSearchValue] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const clients = useAppSelector(state => state.clients);
  const dispatch = useAppDispatch();

  const getClients = async () => {
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
    getClients();
  }, [dispatch, clients]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setSearchValue(e.target.value);
  };

  const handleCancel = () => {
    setShowPopup(false);
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
        <LoadingSpinner />
      ) : clients.length > 0 ? (
        <div className={styles.clients}>
          {clients.map(client => (
            <Row key={client._id} {...client} />
          ))}
        </div>
      ) : (
        <p>No hay clientes disponibles</p>
      )}

      <div className={styles.btn_container}>
        <Button title='Agregar cliente' styleName='btn_outline' onclick={() => setShowPopup(true)} icon={addIcon} />
      </div>
      {showPopup && (
        <FormCreate
          title='Información del cliente'
          buttonText='Confirmar'
          setShowPopup={setShowPopup}
          onCancel={handleCancel}
        />
      )}
    </section>
  );
};

export default ClientsPage;

"use client";
import { useState, useEffect } from "react";
import Files from "./Files";
import Form from "./Form";
import Sequence from "./Sequence";
import styles from "./styles.module.scss";
import { get } from "@/services/fetch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBusinessData } from "@/store/features/businessSlice";
import { ENV } from "@/typescript/types/environment.enum";

const Business = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const business = useAppSelector(data => data.business);

  const handleFetch = async () => {
    try {
      const response = await get("small-business/me", ENV.DASH);
      if (response?.data.statusCode === 200) {
        dispatch(setBusinessData(response.data.result.data.smallBusiness));
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [dispatch]);

  return (
    <section className={styles.container}>
      <div className={styles.inner_container}>
        <Form />
        <Files handleFetch={handleFetch} loading={loading} />
        <Sequence />
      </div>
    </section>
  );
};

export default Business;

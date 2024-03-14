"use client";
import { useState, useEffect } from "react";
import Files from "./Files";
import Form from "./Form";
import Sequence from "./Sequence";
import styles from "./styles.module.scss";
import { get } from "@/services/fetch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBusinessData } from "@/store/features/businessSlice";

const Business = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const business = useAppSelector(data => data.business);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const response = await get("small-business/me", "NEXT_PUBLIC_API_DASH");
        if (response?.statusCode === 200) {
          dispatch(setBusinessData(response.data.result.data.smallBusiness));
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    handleFetch();
  }, [business]);

  return (
    <section className={styles.container}>
      <div className={styles.inner_container}>
        <Form />
        <Files />
        <Sequence />
      </div>
    </section>
  );
};

export default Business;

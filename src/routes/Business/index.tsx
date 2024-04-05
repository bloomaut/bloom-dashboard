"use client";
import styles from "./styles.module.scss";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { get } from "@/services/fetch";
import { useAppDispatch } from "@/store/hooks";
import { setBusinessData } from "@/store/features/businessSlice";
import { setFilesData } from "@/store/features/filesSlice";
import { ENV } from "@/typescript/types/environment.enum";
//Componentes
import LoadingSpinner from "@/components/Loading";
import Breadcrumb from "@/components/Breadcrumb";
import Files from "./Files";
import Form from "./Form";
import Sequence from "./Sequence";

const Business = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const dict = useTranslations("dict.business");

  const fetchData = async () => {
    try {
      const userData = await get("small-business/me", ENV.DASH);
      if (userData?.statusCode === 200) {
        dispatch(setBusinessData(userData.result.data.smallBusiness));
      }
      const userFiles = await get("small-files/media", ENV.DASH);
      if (userFiles?.statusCode === 200) {
        dispatch(setFilesData(userFiles.result.folder));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  return (
    <section className={styles.container}>
      <div className={styles.breadcrumb_container}>
        <Breadcrumb title={dict("breadcrumb_title")} />
      </div>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.inner_container}>
          <Form />
          <Files fetchData={fetchData} />
          <Sequence />
        </div>
      )}
    </section>
  );
};

export default Business;

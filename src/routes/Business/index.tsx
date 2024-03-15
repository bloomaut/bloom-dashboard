"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Files from "./Files";
import Form from "./Form";
import Sequence from "./Sequence";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { get } from "@/services/fetch";
import { useAppDispatch } from "@/store/hooks";
import { setBusinessData } from "@/store/features/businessSlice";
import { setFilesData } from "@/store/features/filesSlice";
import { ENV } from "@/typescript/types/environment.enum";
import LoadingSpinner from "@/components/Loading";

const Business = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const dict = useTranslations("dict.business");

  const fetchData = async () => {
    try {
      const userData = await get("small-business/me", ENV.DASH);
      if (userData?.data.statusCode === 200) {
        dispatch(setBusinessData(userData.data.result.data.smallBusiness));
      }
      const userFiles = await get("small-files/media", ENV.DASH);
      if (userFiles?.data.statusCode === 200) {
        dispatch(setFilesData(userFiles.data.result.folder));
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
          <Files />
          <Sequence />
        </div>
      )}
    </section>
  );
};

export default Business;

"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import Files from "./Files";
import Form from "./Form";
import Sequence from "./Sequence";
import styles from "./styles.module.scss";
import { useTranslations } from "next-intl";
import { get } from "@/services/fetch";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBusinessData } from "@/store/features/businessSlice";
import { setFilesData } from "@/store/features/filesSlice";
import { ENV } from "@/typescript/types/environment.enum";

const Business = () => {
  const business = useAppSelector(state => state.business);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const dict = useTranslations("dict.business");

  const submitForm = (formData: any) => {
    console.log(formData);
  };

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

  const handleFetch = async () => {
    setLoading(true);
    await fetchData();
  };

  useEffect(() => {
    handleFetch();
  }, [dispatch]);

  return (
    <section className={styles.container}>
      <div className={styles.breadcrumb_container}>
        <Breadcrumb title={dict("breadcrumb_title")} />
      </div>
      <div className={styles.inner_container}>
        <Form submitForm={submitForm} />
        <Files handleFetch={handleFetch} loading={loading} />
        <Sequence />
      </div>
    </section>
  );
};

export default Business;

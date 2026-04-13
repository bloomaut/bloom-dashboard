"use client";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getQuest } from "@/services/fetch";
import styles from "./styles.module.scss";

export async function generateMetadata({ params }: { params: { id: string } }) {
  return { title: `Usuario ${params.id}` };
}

export default async function UserDetailPage({ params }: { params: { locale: string; id: string } }) {
  const { locale, id } = params;
  let data: any = null;
  let error: string | null = null;

  try {
    data = await getQuest(Number(id));
  } catch (e: any) {
    error = e?.message ?? "Error al obtener detalles del usuario";
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Usuario #{id}</h1>
        <Link href={`/${locale}/backoffice/users`}>
          <Button variant='outline' className={styles.backButton}>
            Volver a Usuarios
          </Button>
        </Link>
      </div>

      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}>
          <CardTitle className={styles.cardTitle}>Detalles</CardTitle>
        </CardHeader>
        <CardContent className={styles.cardContent}>
          {error ? (
            <div className={styles.errorMessage}>{error}</div>
          ) : (
            <pre className={styles.dataDisplay}>{JSON.stringify(data, null, 2)}</pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getQuest } from "@/services/fetch";

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
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>Usuario #{id}</h1>
        <Link href={`/${locale}/backoffice/users`}>
          <Button variant='outline'>Volver a Usuarioss</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className='text-red-600 text-sm'>{error}</div>
          ) : (
            <pre className='text-sm whitespace-pre-wrap break-words bg-muted p-4 rounded'>
              {JSON.stringify(data, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

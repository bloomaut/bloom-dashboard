import { redirect } from "next/navigation";

export default function BackofficeIndex({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/dashboard/home`);
}

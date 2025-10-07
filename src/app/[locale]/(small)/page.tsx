import { redirect } from "next/navigation";

export default function Home({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}/my-business`);
  return null;
}

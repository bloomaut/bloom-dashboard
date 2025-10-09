import UserDetail from "@/features/(backoffice)/UserDetail";

export default function UserDetailPage({ params }: { params: { locale: string; id: string } }) {
  return <UserDetail params={params} />;
}

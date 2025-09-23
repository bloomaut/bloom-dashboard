import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutWrapper } from "./LayoutWrapper";

export default function Config() {
  return (
    <LayoutWrapper
      title='Configuración'
      description='Ajustes y configuración del sistema'
      breadcrumbs={[{ label: "Configuración" }]}
    >
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-muted-foreground'>Panel de configuración en desarrollo.</p>
        </CardContent>
      </Card>
    </LayoutWrapper>
  );
}

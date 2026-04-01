import React from 'react';
import { 
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, 
  IonCardTitle, IonCardSubtitle, IonCardContent, IonIcon, IonButton 
} from '@ionic/react';
import { documentTextOutline, statsChartOutline } from 'ionicons/icons';

// Recibimos el "nombre" desde el componente padre
export default function DashboardView({ nombre }: { nombre: string }) {
  return (
    <>
      <div style={{ padding: '20px 20px 5px 20px' }}>
        <h1 style={{ fontWeight: '700', margin: '0 0 5px 0' }}>
          ¡Hola, {nombre ? nombre : 'Usuario'}! 👋
        </h1>
        <p style={{ margin: 0, color: 'gray' }}>Aquí tienes un resumen de tu actividad.</p>
      </div>

      <IonGrid style={{ padding: '10px' }}>
        <IonRow>
          <IonCol size="12" sizeMd="6">
            <IonCard style={{ margin: '10px' }}>
              <IonCardHeader>
                <IonIcon icon={documentTextOutline} color="tertiary" style={{ fontSize: '32px', marginBottom: '10px' }} />
                <IonCardTitle>Resumen Gestiones</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div style={{ marginTop: '15px' }}>
                  <IonButton fill="outline" size="small">Ver mis gestiones</IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>

          {/* Puedes agregar más tarjetas aquí */}
        </IonRow>
      </IonGrid>
    </>
  );
}
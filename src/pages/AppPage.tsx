import React, { useEffect, useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonButton,
  useIonRouter,
  IonMenu,
  IonMenuButton,
  IonButtons,
  IonList,
  IonItem,
  IonLabel,
  IonImg,
  IonMenuToggle,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/react';

// Importamos los íconos oficiales de Ionic
import { 
  personOutline, 
  settingsOutline, 
  logOutOutline, 
  homeOutline,
  statsChartOutline,
  documentTextOutline
} from 'ionicons/icons';

export default function AppPage() {
  const router = useIonRouter();
  const [nombre, setNombre] = useState<string>('');

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('nombreUsuario');
    if (usuarioGuardado) {
      setNombre(usuarioGuardado);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombreUsuario'); // Limpiamos también el nombre
    router.push('/home', 'back', 'pop'); 
  };

  return (
    <>
      {/* --- MENÚ LATERAL --- */}
      <IonMenu contentId="main-content">
        {/* ion-no-border quita la línea debajo del header para un look más moderno */}
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0 10px 0' }}>
              <IonImg
                src="/PR.png"
                alt="Logo"
                style={{ width: '160px', marginBottom: '15px' }}
              />
              <IonText color="medium">
                <p style={{ margin: 0, fontSize: '14px', fontWeight: '500' }}>Panel de Control</p>
              </IonText>
            </div>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonList lines="none" style={{ marginTop: '10px' }}>
            <IonMenuToggle autoHide={false}>
              
              {/* Opción activa simulada */}
              <IonItem button color="light" style={{ borderRadius: '0 20px 20px 0', marginRight: '10px' }}>
                <IonIcon slot="start" icon={homeOutline} color="primary" />
                <IonLabel color="primary" style={{ fontWeight: '600' }}>Inicio</IonLabel>
              </IonItem>

              <IonItem button>
                <IonIcon slot="start" icon={personOutline} color="medium" />
                <IonLabel>Mi Perfil</IonLabel>
              </IonItem>
              
              <IonItem button>
                <IonIcon slot="start" icon={settingsOutline} color="medium" />
                <IonLabel>Configuración</IonLabel>
              </IonItem>
              
              <IonItem button onClick={handleLogout} style={{ marginTop: '30px' }}>
                <IonIcon slot="start" icon={logOutOutline} color="danger" />
                <IonLabel color="danger" style={{ fontWeight: '500' }}>Cerrar Sesión</IonLabel>
              </IonItem>

            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>

      {/* --- PANTALLA PRINCIPAL --- */}
      <IonPage id="main-content">
        <IonHeader className="ion-no-border">
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle style={{ fontWeight: '600' }}>Princeps</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent color="light">
          {/* Header del contenido */}
          <div style={{ padding: '20px 20px 5px 20px' }}>
            <IonText color="dark">
              <h1 style={{ fontWeight: '700', margin: '0 0 5px 0' }}>
                ¡Hola, {nombre ? nombre : 'Usuario'}! 👋
              </h1>
              <p style={{ margin: 0, color: 'gray' }}>
                Aquí tienes un resumen de tu actividad.
              </p>
            </IonText>
          </div>

          {/* Cuadrícula de Tarjetas (Dashboard) */}
          <IonGrid style={{ padding: '10px' }}>
            <IonRow>
              {/* Tarjeta 1 */}
              <IonCol size="12" sizeMd="6">
                <IonCard style={{ margin: '10px' }}>
                  <IonCardHeader>
                    <IonIcon icon={documentTextOutline} color="tertiary" style={{ fontSize: '32px', marginBottom: '10px' }} />
                    <IonCardSubtitle>Reportes</IonCardSubtitle>
                    <IonCardTitle>Documentos Recientes</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    No tienes documentos pendientes por revisar en este momento.
                    <div style={{ marginTop: '15px' }}>
                      <IonButton fill="outline" size="small">Ver historial</IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>

              {/* Tarjeta 2 */}
              <IonCol size="12" sizeMd="6">
                <IonCard style={{ margin: '10px' }}>
                  <IonCardHeader>
                    <IonIcon icon={statsChartOutline} color="success" style={{ fontSize: '32px', marginBottom: '10px' }} />
                    <IonCardSubtitle>Estadísticas</IonCardSubtitle>
                    <IonCardTitle>Actividad Mensual</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    Tu rendimiento ha incrementado un 15% comparado con el mes anterior.
                    <div style={{ marginTop: '15px' }}>
                      <IonButton fill="solid" color="success" size="small">Ver detalles</IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>

        </IonContent>
      </IonPage>
    </>
  );
}
import React, { useEffect, useState } from 'react';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton,
  useIonRouter, IonMenu, IonMenuButton, IonButtons, IonList, IonItem,
  IonLabel, IonImg, IonMenuToggle, IonIcon
} from '@ionic/react';

import { homeOutline, peopleOutline, settingsOutline, logOutOutline } from 'ionicons/icons';

// 1. IMPORTAMOS TUS NUEVOS ARCHIVOS
import DashboardView from '../views/DashboardView';
import ClientesView from '../views/ClientesView';

export default function AppPage() {
  const router = useIonRouter();
  const [nombre, setNombre] = useState<string>('');
  
  // 2. CREAMOS EL ESTADO PARA CONTROLAR LA VISTA
  const [vistaActiva, setVistaActiva] = useState<string>('dashboard');

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('nombreUsuario');
    if (usuarioGuardado) setNombre(usuarioGuardado);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombreUsuario');
    router.push('/home', 'back', 'pop'); 
  };

  return (
    <>
      <IonMenu contentId="main-content">
        <IonHeader className="ion-no-border">
          <IonToolbar>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 0 10px 0' }}>
              <IonImg src="/PR.png" style={{ width: '160px', marginBottom: '15px' }} />
            </div>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          <IonList lines="none" style={{ marginTop: '10px' }}>
            <IonMenuToggle autoHide={false}>
              
              {/* Botón Inicio */}
              <IonItem button onClick={() => setVistaActiva('dashboard')} color={vistaActiva === 'dashboard' ? 'light' : ''}>
                <IonIcon slot="start" icon={homeOutline} color={vistaActiva === 'dashboard' ? 'primary' : 'medium'} />
                <IonLabel color={vistaActiva === 'dashboard' ? 'primary' : ''}>Inicio</IonLabel>
              </IonItem>

              {/* Botón Clientes */}
              <IonItem button onClick={() => setVistaActiva('clientes')} color={vistaActiva === 'clientes' ? 'light' : ''}>
                <IonIcon slot="start" icon={peopleOutline} color={vistaActiva === 'clientes' ? 'primary' : 'medium'} />
                <IonLabel color={vistaActiva === 'clientes' ? 'primary' : ''}>Gestión de Clientes</IonLabel>
              </IonItem>
              
              <IonItem button onClick={handleLogout} style={{ marginTop: '30px' }}>
                <IonIcon slot="start" icon={logOutOutline} color="danger" />
                <IonLabel color="danger">Cerrar Sesión</IonLabel>
              </IonItem>

            </IonMenuToggle>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonPage id="main-content">
        <IonHeader className="ion-no-border">
          <IonToolbar color="primary">
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle style={{ fontWeight: '600' }}>
              {vistaActiva === 'dashboard' ? 'Dashboard' : 'Clientes'}
            </IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent color="light">
          {/* 3. AQUÍ OCURRE LA MAGIA DEL RENDERIZADO */}
          {vistaActiva === 'dashboard' && <DashboardView nombre={nombre} />}
          {vistaActiva === 'clientes' && <ClientesView />}
        </IonContent>
      </IonPage>
    </>
  );
}
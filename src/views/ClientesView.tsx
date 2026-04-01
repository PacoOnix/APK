import React from 'react';
import { IonText } from '@ionic/react';

export default function ClientesView() {
  return (
    <div style={{ padding: '20px' }}>
      <IonText color="dark">
        <h1 style={{ fontWeight: '700' }}>Gestión de Cartera</h1>
        <p>Aquí cargaremos la lista de clientes desde Laravel...</p>
      </IonText>
    </div>
  );
}
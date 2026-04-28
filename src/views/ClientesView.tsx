import React, { useState, useEffect } from 'react';
import { 
  IonList, 
  IonItem, 
  IonLabel, 
  IonAvatar, 
  IonSearchbar, 
  IonSpinner, 
  IonText,
  IonIcon,
  IonBadge
} from '@ionic/react';
import { getApiUrl } from '../config/api';
import { personCircleOutline, alertCircleOutline } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';

interface Credito {
  id_credito: number;
  referencia_externa: string;
}

// 1. AÑADIMOS EL ARREGLO DE CRÉDITOS A LA INTERFACE DEL CLIENTE
interface Cliente {
  id_cliente: number;
  nombre_razon_social: string;
  nombre_adicional?: string;
  apellido_paterno: string;
  apellido_materno?: string;
  creditos?: Credito[]; 
}

export default function ClientesView({ onVerDetalle }: { onVerDetalle: (id: number) => void }) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [textoBusqueda, setTextoBusqueda] = useState<string>('');
  const [error, setError] = useState<string | null>(null);


  const cargarClientes = async () => {
    setCargando(true);
    setError(null);
    
    try {
      const baseUrl = getApiUrl();
      const token = localStorage.getItem('token');

      const response = await fetch(`${baseUrl}/clientes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        throw new Error('No se pudo conectar con el servidor');
      }

      const data = await response.json();
      console.log('Clientes recibidos:', data); 
      setClientes(data.data);

    } catch (err: any) {
      console.error('Error al traer clientes:', err);
      setError('Hubo un problema al cargar tu cartera de clientes.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

 const clientesFiltrados = clientes.filter(cliente => {
    const busqueda = textoBusqueda.toLowerCase();

    const partesNombre = [
      cliente.nombre_razon_social,
      cliente.nombre_adicional,
      cliente.apellido_paterno,
      cliente.apellido_materno
    ];

    const nombreCompleto = partesNombre.filter(Boolean).join(' ').toLowerCase();
    
    if (nombreCompleto.includes(busqueda)) {
      return true;
    }

    if (cliente.creditos && cliente.creditos.length > 0) {

      const tieneCreditoCoincidente = cliente.creditos.some(credito => 
        credito.referencia_externa.toLowerCase().includes(busqueda)
      );
      
      if (tieneCreditoCoincidente) {
        return true; 
      }
    }

    return false;
  });

  return (
    <>
      <div style={{ backgroundColor: '#fff', paddingBottom: '10px' }}>
        <IonSearchbar 
          placeholder="Buscar por nombre..." 
          value={textoBusqueda}
          onIonInput={(e: any) => setTextoBusqueda(e.target.value)}
          animated={true}
        />
      </div>

      {cargando && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <IonSpinner name="crescent" color="primary" />
          <p>Cargando cartera...</p>
        </div>
      )}

      {error && !cargando && (
        <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
          <IonIcon icon={alertCircleOutline} color="danger" style={{ fontSize: '40px' }} />
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        </div>
      )}

      {/* Lista de Clientes */}
      {!cargando && !error && (
        <IonList>
          {clientesFiltrados.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '30px', color: 'gray' }}>
              <p>No se encontraron clientes o créditos con esa búsqueda.</p>
            </div>
          ) : (
            clientesFiltrados.map((cliente) => (
              <IonItem 
                button 
                key={cliente.id_cliente} 
                detail={true}
                onClick={() => onVerDetalle(cliente.id_cliente)} // <-- ESTO CONECTA EL CLIC CON EL CAMBIO DE PANTALLA
              >
                <IonAvatar slot="start">
                  <IonIcon icon={personCircleOutline} style={{ fontSize: '40px', color: '#999' }} />
                </IonAvatar>
                
                <IonLabel>
                  <h2 style={{ fontWeight: 'bold' }}>
                    {cliente.nombre_razon_social} {cliente.apellido_paterno} {cliente.apellido_materno}
                  </h2>
                  <p style={{ marginBottom: '5px' }}>ID: {cliente.id_cliente}</p>
                  
                  {/* AQUÍ IMPRIMIMOS TODOS LOS CRÉDITOS DEL CLIENTE */}
                  {cliente.creditos && cliente.creditos.length > 0 ? (
                    cliente.creditos.map((credito) => (
                      <IonText color="primary" key={credito.id_credito}>
                        <p style={{ fontSize: '0.85em', fontWeight: '500', margin: '2px 0' }}>
                          🧾 Ref: {credito.referencia_externa}
                        </p>
                      </IonText>
                    ))
                  ) : (
                    <IonText color="medium">
                      <p style={{ fontSize: '0.85em', fontStyle: 'italic' }}>Sin créditos activos</p>
                    </IonText>
                  )}
                </IonLabel>

                {/* Badge visual dependiendo de si tiene o no créditos */}
                <IonBadge color={cliente.creditos && cliente.creditos.length > 0 ? "success" : "light"} slot="end">
                  {cliente.creditos && cliente.creditos.length > 0 ? cliente.creditos.length + ' Activo(s)' : 'Vació'}
                </IonBadge>
              </IonItem>
            ))
          )}
        </IonList>
      )}
    </>
  );
}
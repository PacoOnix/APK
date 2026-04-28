import React, { useState, useEffect , useRef} from 'react';
import { 
  IonButton, IonIcon, IonText, IonCard, IonCardHeader, 
  IonCardTitle, IonCardContent, IonGrid, IonRow, IonCol, 
  IonSpinner, IonBadge
} from '@ionic/react';
import { arrowBackOutline, cashOutline, callOutline } from 'ionicons/icons';
import { getApiUrl } from '../config/api';
import { App } from '@capacitor/app';


// 1. INTERFACES ACTUALIZADAS
interface Telefono {
  id_telefonos: number;
  telefono: string;
  status_activo: string;
}

interface DetalleCliente {
  id_cliente: number;
  nombre_razon_social: string;
  apellido_paterno: string;
  telefonos?: Telefono[]; // Ahora acepta el arreglo de teléfonos
  creditos: any[]; 
}

interface Props {
  idCliente: number;
  onRegresar: () => void;
}

export default function ClienteDetalleView({ idCliente, onRegresar }: Props) {
  const [cliente, setCliente] = useState<DetalleCliente | null>(null);
  const [cargando, setCargando] = useState(true);
  const inicioLlamadaRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchExpediente = async () => {
      try {
        const baseUrl = getApiUrl();
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${baseUrl}/clientes/${idCliente}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setCliente(data.data || data);
      } catch (error) {
        console.error("Error al cargar expediente:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchExpediente();
  }, [idCliente]);

  // 2. FUNCIÓN DE LLAMADA NATIVA (SIN PLUGINS CONFLICTIVOS)
const realizarLlamada = async (telefono?: string) => {
    if (!telefono) {
      alert("Este cliente no tiene un número de teléfono registrado.");
      return;
    }

    try {
      // 1. Guardamos la hora en la caja fuerte de la referencia (Instantáneo)
      inicioLlamadaRef.current = Date.now();
      
      // 2. Limpiamos cualquier "oyente" anterior por si hubo clics dobles
      await App.removeAllListeners();

      // 3. Abrimos el marcador nativo
      window.open(`tel:${telefono}`, '_system');
      
      // 4. Creamos el nuevo oyente
      App.addListener('appStateChange', ({ isActive }) => {
        // Leemos el valor instantáneo usando .current
        if (isActive && inicioLlamadaRef.current) {
          const finLlamada = Date.now();
          const duracionSegundos = Math.floor((finLlamada - inicioLlamadaRef.current) / 1000);
          
          if (duracionSegundos > 5) { 
             registrarTiempoGestion(duracionSegundos);
          }
          
          // Vaciamos la caja fuerte y apagamos el oyente
          inicioLlamadaRef.current = null;
          App.removeAllListeners();
        }
      });
    } catch (error) {
      console.error("Error al llamar:", error);
    }
  };

  const registrarTiempoGestion = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segRestantes = segundos % 60;
    alert(`Llamada terminada. Duración: ${minutos}m ${segRestantes}s. ¿Deseas guardar esta gestión?`);
  };

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <IonSpinner name="crescent" color="primary" />
        <p>Abriendo expediente...</p>
      </div>
    );
  }

  // 3. EXTRAEMOS EL PRIMER TELÉFONO DE LA LISTA
  const telefonoPrincipal = (cliente?.telefonos && cliente.telefonos.length > 0) 
    ? cliente.telefonos[0].telefono 
    : undefined;

  // 4. RENDERIZADO VISUAL
  return (
    <div style={{ padding: '10px' }}>
      <IonButton fill="clear" onClick={onRegresar} style={{ marginBottom: '10px' }}>
        <IonIcon slot="start" icon={arrowBackOutline} />
        Volver a la lista
      </IonButton>

      {cliente && (
        <>
          <div style={{ paddingLeft: '10px', marginBottom: '20px' }}>
            <h1 style={{ fontWeight: '700', margin: 0 }}>
              {cliente.nombre_razon_social} {cliente.apellido_paterno}
            </h1>
            <p style={{ color: 'gray', margin: 0 }}>ID de Cliente: #{cliente.id_cliente}</p>
            
            <div style={{ marginTop: '15px' }}>
              <IonButton 
                color="tertiary" 
                onClick={() => realizarLlamada(telefonoPrincipal)}
                disabled={!telefonoPrincipal} 
              >
                <IonIcon slot="start" icon={callOutline} />
                {telefonoPrincipal ? `Llamar al ${telefonoPrincipal}` : 'Sin número registrado'}
              </IonButton>
            </div>
          </div>

          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <IonText color="primary">
                  <h3 style={{ marginLeft: '10px', fontWeight: '600' }}>Créditos Vigentes</h3>
                </IonText>
                
                {cliente.creditos && cliente.creditos.length > 0 ? (
                  cliente.creditos.map((credito) => (
                    <IonCard key={credito.id_credito} style={{ margin: '10px 0' }}>
                      <IonCardHeader>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <IonCardTitle style={{ fontSize: '1.1em' }}>
                            Ref: {credito.referencia_externa}
                          </IonCardTitle>
                          <IonBadge color="success">Activo</IonBadge>
                        </div>
                      </IonCardHeader>
                      <IonCardContent>
                        <p><strong>Monto Original:</strong> ${credito.monto_credito || '0.00'}</p>
                        <p><strong>Saldo Actual:</strong> ${credito.saldo_pendiente || '0.00'}</p>
                        
                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                          <IonButton size="small" color="success">
                            <IonIcon slot="start" icon={cashOutline} />
                            Abonar
                          </IonButton>
                          <IonButton size="small" fill="outline">
                            Ver Pagos
                          </IonButton>
                        </div>
                      </IonCardContent>
                    </IonCard>
                  ))
                ) : (
                  <p style={{ marginLeft: '10px' }}>No hay créditos registrados.</p>
                )}
              </IonCol>
            </IonRow>
          </IonGrid>
        </>
      )}
    </div>
  );
}
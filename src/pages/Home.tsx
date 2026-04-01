
import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonImg,
  useIonRouter // <-- Nuevo import
} from '@ionic/react';

const Home: React.FC = () => {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  
  // 2. Inicializa el router
  const router = useIonRouter(); 
  // Esta función decide a qué puerta tocar dependiendo del dispositivo
  const getApiUrl = () => {
    if (Capacitor.getPlatform() === 'android') {
      // Si estoy en el celular/emulador, uso la IP mágica
      return 'http://10.0.2.2:8080/o1/public/api'; 
    } else {
      // Si estoy en el navegador de la computadora, uso el dominio local
      return 'http://pactiva.com/o1/public/api'; 
    }
  };



  const handleLogin = async () => {

    const baseUrl = getApiUrl();
    if (!usuario.trim() || !password.trim()) {
      setMensaje('Debes ingresar usuario y contraseña');
      return;
    }

    setMensaje('');
    setCargando(true);

    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify({
          user: usuario, 
          pass: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales incorrectas');
      }

      console.log('Login exitoso, redirigiendo...', data);
      localStorage.setItem('token', data.data.sal);
      localStorage.setItem('nombreUsuario', data.data.nombre);
      router.push('/app', 'forward', 'push');

    } catch (error: any) {
      console.error('Error en el login:', error);
      setMensaje(error.message || 'Ocurrió un problema de conexión');
    } finally {
      setCargando(false);
    }
  };
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '100%',
            maxWidth: '400px',
            margin: '0 auto'
          }}
        >
          <IonImg
            src="/PR.png"
            alt="Logo"
            style={{
              width: '200px',
              margin: '0 auto 20px auto'
            }}
          />
          {mensaje && (
            <IonText color="danger" style={{ textAlign: 'center', marginBottom: '15px' }}>
              <p>{mensaje}</p>
            </IonText>
          )}
          <IonText style={{ textAlign: 'center', marginBottom: '30px' }}>
            <p>Ingresa tu usuario y contraseña para continuar</p>
          </IonText>

          <IonItem style={{ marginBottom: '15px', borderRadius: '8px' }}>
            <IonLabel position="stacked">Usuario</IonLabel>
            <IonInput
              type="text"
              placeholder="Tu usuario"
              value={usuario}
              onIonInput={(e) => setUsuario(e.detail.value!)}
            />
          </IonItem>

          <IonItem style={{ marginBottom: '20px', borderRadius: '8px' }}>
            <IonLabel position="stacked">Contraseña</IonLabel>
            <IonInput
              type="password"
              placeholder="********"
              value={password}
              onIonInput={(e) => setPassword(e.detail.value!)}
            />
          </IonItem>

          <IonButton expand="block" onClick={handleLogin} disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
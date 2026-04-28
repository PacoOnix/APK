
import { Capacitor } from '@capacitor/core';

export const getApiUrl = () => {
  if (Capacitor.getPlatform() === 'android') {
    // Si estoy en el celular/emulador, uso la IP del servidor de desarrollo
    return 'http://52.3.247.23/o1/public/api'; 
  } else {
    // Si estoy en el navegador de la computadora, uso el dominio local
    return 'http://pactiva.com/o1/public/api'; 
  }
};
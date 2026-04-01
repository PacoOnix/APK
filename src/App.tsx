import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

import Home from './pages/Home';
import AppPage from './pages/AppPage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';


import '@ionic/react/css/palettes/dark.system.css';

import './theme/variables.css';

setupIonicReact();

const RutaPrivada: React.FC<{ children: React.ReactNode; path: string; exact?: boolean }> = ({ children, ...rest }) => {
const isAuthenticated = !!localStorage.getItem('token'); 

return (
    <Route {...rest}>
      {isAuthenticated ? children : <Redirect to="/home" />}
    </Route>
  );
};

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        
        <RutaPrivada exact path="/app">
          <AppPage /> 
        </RutaPrivada>
        
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
import { IonApp } from '@ionic/react';
import { Route, Switch } from 'wouter';
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { useEffect } from 'react';
import { useAppContext } from './store/AppContext';

function App() {
  const { fetchPets, fetchOwners, fetchShowcasePets } = useAppContext();
  
  // Load initial data when app loads
  useEffect(() => {
    fetchPets();
    fetchOwners();
    fetchShowcasePets();
  }, []);

  return (
    <IonApp>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </IonApp>
  );
}

export default App;

import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { home, paw, person, heart } from 'ionicons/icons';
import { useLocation } from 'wouter';

const TabBar = () => {
  const [location] = useLocation();

  const getSelectedTab = () => {
    if (location === '/home/main') return 'home';
    if (location === '/home/pets') return 'pets';
    if (location === '/home/favorites') return 'favorites';
    if (location === '/home/profile') return 'profile';
    return 'home';
  };

  return (
    <IonTabBar slot="bottom" selectedTab={getSelectedTab()}>
      <IonTabButton tab="home" href="/home/main">
        <IonIcon icon={home} />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
      
      <IonTabButton tab="pets" href="/home/pets">
        <IonIcon icon={paw} />
        <IonLabel>Pets</IonLabel>
      </IonTabButton>
      
      <IonTabButton tab="favorites" href="/home/favorites">
        <IonIcon icon={heart} />
        <IonLabel>Favorites</IonLabel>
      </IonTabButton>
      
      <IonTabButton tab="profile" href="/home/profile">
        <IonIcon icon={person} />
        <IonLabel>Profile</IonLabel>
      </IonTabButton>
    </IonTabBar>
  );
};

export default TabBar; 
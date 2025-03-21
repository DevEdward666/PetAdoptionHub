import { useState } from "react";
import AdoptPet from "./adopt-pet";
import PetOwners from "./pet-owners";
import PetShowcase from "./pet-showcase";
import ReportCruelty from "./report-cruelty";
import { useAppContext } from "../store/AppContext";
import { 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonButtons, 
  IonButton, 
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonRouterOutlet
} from "@ionic/react";
import { 
  searchOutline, 
  notificationsOutline, 
  pawOutline, 
  homeOutline, 
  heartOutline, 
  personOutline 
} from 'ionicons/icons';

export default function Home() {
  const [activeTab, setActiveTab] = useState("adopt");
  const { state } = useAppContext();

  const renderContent = () => {
    console.log(activeTab);
    switch (activeTab) {
      case "adopt":
        return <AdoptPet />;
      case "owners":
        return <PetOwners />;
      case "showcase":
        return <PetShowcase />;
      case "report":
        return <ReportCruelty />;
      default:
        return <AdoptPet />;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <div className="flex items-center px-2" slot="start">
            <IonIcon icon={pawOutline} className="text-primary text-2xl mr-2" />
            <IonTitle>PetPals</IonTitle>
          </div>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon slot="icon-only" icon={searchOutline} />
            </IonButton>
            <IonButton>
              <IonIcon slot="icon-only" icon={notificationsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        
        <IonToolbar>
          <IonSegment value={activeTab} onIonChange={e => setActiveTab(e.detail.value as string)}>
            <IonSegmentButton value="adopt">
              <IonLabel>Adopt a Pet</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="owners">
              <IonLabel>Pet Owners</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="showcase">
              <IonLabel>Showcase</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="report">
              <IonLabel>Report</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {renderContent()}
      </IonContent>

      {/* <IonTabBar slot="bottom">
        <IonTabButton tab="home" href="/home">
          <IonIcon icon={homeOutline} />
          <IonLabel>Home</IonLabel>
        </IonTabButton>
        <IonTabButton tab="search">
          <IonIcon icon={searchOutline} />
          <IonLabel>Search</IonLabel>
        </IonTabButton>
        <IonTabButton tab="favorites">
          <IonIcon icon={heartOutline} />
          <IonLabel>Favorites</IonLabel>
          {state.favorites.length > 0 && (
            <span className="absolute top-0 right-6 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {state.favorites.length}
            </span>
          )}
        </IonTabButton>
        <IonTabButton tab="profile" href="/profile">
          <IonIcon icon={personOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar> */}
    </IonPage>
  );
}

import { useAppContext } from '../store/AppContext';
import { 
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonCard,
  IonCardContent,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonBackButton,
  IonPage
} from '@ionic/react';
import { 
  mailOutline,
  pawOutline,
  heartOutline,
  helpCircleOutline,
  logOutOutline,
  personCircleOutline,
  settingsOutline
} from 'ionicons/icons';
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Profile() {
  const { state, user,logout } = useAppContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Mock profile data - in a real app this would come from API/context
  const profile = {
    name: user?.name,
    email: user?.email,
    favorites: state.favorites.length
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setLocation("/");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>My Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <div className="flex flex-col items-center mb-6 pt-4">
          <IonAvatar className="w-24 h-24 mb-4">
            <div className="bg-primary/10 w-full h-full rounded-full flex items-center justify-center">
              <IonIcon icon={personCircleOutline} className="text-5xl text-primary" />
            </div>
          </IonAvatar>
          <h2 className="text-2xl font-bold text-center">{profile.name}</h2>
          <p className="text-muted-foreground">Pet Lover</p>
        </div>
        
        <IonCard>
          <IonCardContent className="px-4">
            <h3 className="font-medium mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <IonIcon icon={mailOutline} className="text-primary mr-3" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p>{profile.email}</p>
                </div>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
        
        <div className="mt-6">
          <IonList className="bg-transparent">
            <IonItem button detail lines="full" href="/favorites" className="mb-2">
              <IonIcon icon={heartOutline} slot="start" className="text-primary" />
              <IonLabel>My Favorites</IonLabel>
              <div slot="end" className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                {profile.favorites}
              </div>
            </IonItem>
            
            <IonItem button detail lines="full" href="/settings" className="mb-2">
              <IonIcon icon={settingsOutline} slot="start" className="text-primary" />
              <IonLabel>Settings</IonLabel>
            </IonItem>
            
            <IonItem button detail lines="full" href="/help" className="mb-2">
              <IonIcon icon={helpCircleOutline} slot="start" className="text-primary" />
              <IonLabel>Help & Support</IonLabel>
            </IonItem>
            
            <Separator className="my-4" />
            
            <IonItem button detail={false} lines="none" onClick={handleLogout} className="text-destructive">
              <IonIcon icon={logOutOutline} slot="start" className="text-destructive" />
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonList>
        </div>
        
        <div className="mt-8 mb-4 flex items-center justify-center">
          <IonIcon icon={pawOutline} className="text-muted-foreground mr-2" />
          <p className="text-sm text-muted-foreground">Pawfect Match v1.0.0</p>
        </div>
      </IonContent>
    </IonPage>
  );
}
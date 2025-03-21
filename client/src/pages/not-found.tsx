import { Link } from "wouter";
import { IonPage, IonContent, IonButton, IonIcon, IonCard, IonCardContent } from "@ionic/react";
import { alertCircleOutline, homeOutline } from "ionicons/icons";

export default function NotFound() {
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="h-full flex items-center justify-center">
          <IonCard className="w-full max-w-md mx-4">
            <IonCardContent className="ion-padding">
              <div className="flex items-center mb-4 gap-2">
                <IonIcon 
                  icon={alertCircleOutline} 
                  className="text-red-500" 
                  style={{ fontSize: '2rem' }} 
                />
                <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
              </div>
              
              <p className="mt-4 text-sm text-gray-600 mb-6">
                The page you're looking for doesn't exist or has been moved.
              </p>
              
              <Link href="/">
                <IonButton expand="block" className="font-semibold">
                  <IonIcon slot="start" icon={homeOutline} />
                  Go Home
                </IonButton>
              </Link>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
}

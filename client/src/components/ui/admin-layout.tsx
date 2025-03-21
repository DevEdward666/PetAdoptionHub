import { ReactNode, useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAdmin } from '@/store/AdminContext';
import { 
  IonPage, 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonMenuButton, 
  IonTitle, 
  IonMenu, 
  IonItem, 
  IonIcon, 
  IonLabel, 
  IonList, 
  IonMenuToggle,
  IonFooter,
  IonButton
} from '@ionic/react';
import { 
  homeOutline, 
  peopleOutline, 
  pawOutline, 
  warningOutline, 
  personOutline, 
  basketOutline, 
  logOutOutline 
} from 'ionicons/icons';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { admin, logout } = useAdmin();
  const [location] = useLocation();
  const [activePath, setActivePath] = useState<string>('/admin/dashboard');

  useEffect(() => {
    setActivePath(location);
  }, [location]);

  if (!admin) {
    return <div>Loading...</div>;
  }

  const menuItems = [
    { title: 'Dashboard', path: '/admin/dashboard', icon: homeOutline },
    { title: 'Pet Management', path: '/admin/pets', icon: pawOutline },
    { title: 'Owner Management', path: '/admin/owners', icon: peopleOutline },
    { title: 'Cruelty Reports', path: '/admin/reports', icon: warningOutline },
    { title: 'Admin Users', path: '/admin/admins', icon: personOutline },
    { title: 'Products', path: '/admin/products', icon: basketOutline },
  ];

  return (
    <>
      <IonMenu contentId="admin-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>PetShop Admin</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="p-4 mb-4 bg-primary/10 rounded-lg">
            <h3 className="font-medium text-lg">{admin.name}</h3>
            <p className="text-sm text-muted-foreground">{admin.email}</p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">Role: {admin.role}</p>
          </div>
          <IonList>
            {menuItems.map((item) => (
              <IonMenuToggle key={item.path}>
                <IonItem 
                  button
                  routerLink={item.path} 
                  routerDirection="forward"
                  color={activePath === item.path ? 'primary' : undefined}
                  className={activePath === item.path ? 'selected' : ''}
                  onClick={() => setActivePath(item.path)}
                >
                  <IonIcon slot="start" icon={item.icon} />
                  <IonLabel>{item.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))}
          </IonList>
        </IonContent>
        <IonFooter>
          <IonItem button onClick={logout}>
            <IonIcon slot="start" icon={logOutOutline} />
            <IonLabel>Logout</IonLabel>
          </IonItem>
          <IonItem button routerLink="/" routerDirection="forward">
            <IonLabel className="text-center text-sm text-muted-foreground p-2">
              Return to Main App
            </IonLabel>
          </IonItem>
        </IonFooter>
      </IonMenu>

      <IonPage id="admin-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{title}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={logout}>
                <IonIcon slot="icon-only" icon={logOutOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          {children}
        </IonContent>
      </IonPage>
    </>
  );
}
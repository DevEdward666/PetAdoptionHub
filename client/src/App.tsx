import { IonApp } from '@ionic/react';
import { Route, Switch } from 'wouter';
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import { useEffect } from 'react';
import { useAppContext } from './store/AppContext';
import { AdminProvider } from './store/AdminContext';

// Admin pages
import AdminLogin from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminOwners from "@/pages/admin/owners";
import AdminPets from "@/pages/admin/pets";
import AdminReports from "@/pages/admin/reports";
import AdminProducts from "@/pages/admin/products";
import AdminUsers from "@/pages/admin/admins";

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
      <AdminProvider>
        <Switch>
          {/* Main App Routes */}
          <Route path="/" component={Home} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
          <Route path="/admin/owners" component={AdminOwners} />
          <Route path="/admin/pets" component={AdminPets} />
          <Route path="/admin/reports" component={AdminReports} />
          <Route path="/admin/products" component={AdminProducts} />
          <Route path="/admin/admins" component={AdminUsers} />
          
          {/* 404 Route */}
          <Route component={NotFound} />
        </Switch>
      </AdminProvider>
    </IonApp>
  );
}

export default App;

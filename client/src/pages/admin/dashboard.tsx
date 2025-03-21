import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats } from '@/lib/adminApi';
import { AdminLayout } from '@/components/ui/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IonIcon } from '@ionic/react';
import { 
  pawOutline, 
  peopleOutline, 
  warningOutline,
  basketOutline,
  hourglassOutline,
} from 'ionicons/icons';

export default function AdminDashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    queryFn: fetchDashboardStats,
  });

  const dashboardCards = [
    {
      title: 'Pets',
      value: data?.counts?.pets || 0,
      icon: pawOutline,
      color: 'bg-blue-500',
    },
    {
      title: 'Owners',
      value: data?.counts?.owners || 0,
      icon: peopleOutline,
      color: 'bg-green-500',
    },
    {
      title: 'Pending Owners',
      value: data?.counts?.pendingOwners || 0,
      icon: hourglassOutline,
      color: 'bg-yellow-500',
    },
    {
      title: 'Reports',
      value: data?.counts?.reports || 0,
      icon: warningOutline,
      color: 'bg-red-500',
    },
    {
      title: 'Products',
      value: data?.counts?.products || 0,
      icon: basketOutline,
      color: 'bg-purple-500',
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load dashboard data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardCards.map((card) => (
            <Card key={card.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <span className={`w-8 h-8 rounded-full ${card.color} flex items-center justify-center mr-2`}>
                    <IonIcon icon={card.icon} className="text-white w-4 h-4" />
                  </span>
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-10 w-20" />
                ) : (
                  <p className="text-3xl font-bold">{card.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  <p>This section will display recent activities like:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>New owner registrations</li>
                    <li>New cruelty reports</li>
                    <li>Updates to pet statuses</li>
                    <li>Product changes</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <a 
                  href="/admin/owners/pending" 
                  className="block w-full p-2 text-sm bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                >
                  Review pending owner approvals ({data?.counts?.pendingOwners || 0})
                </a>
                <a 
                  href="/admin/reports" 
                  className="block w-full p-2 text-sm bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                >
                  Check new cruelty reports ({data?.counts?.reports || 0})
                </a>
                <a 
                  href="/admin/pets" 
                  className="block w-full p-2 text-sm bg-primary/10 hover:bg-primary/20 rounded transition-colors"
                >
                  Manage pet listings ({data?.counts?.pets || 0})
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
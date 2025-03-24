import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllOwners, fetchPendingOwners, approveOwner, deleteOwner } from '@/lib/adminApi';
import { AdminLayout } from '@/components/ui/admin-layout';
import { useToast } from '@/hooks/use-toast';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Owner } from "../../types/schema";
import { IonIcon } from '@ionic/react';
import { checkmarkOutline, closeOutline, trashOutline, personCircleOutline } from 'ionicons/icons';

export default function AdminOwners() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch all owners
  const { 
    data: allOwners = [], 
    isLoading: isLoadingAllOwners 
  } = useQuery({
    queryKey: ['/api/admin/owners'],
    queryFn: fetchAllOwners
  });

  // Fetch pending owners
  const { 
    data: pendingOwners = [], 
    isLoading: isLoadingPendingOwners 
  } = useQuery({
    queryKey: ['/api/admin/owners/pending'],
    queryFn: fetchPendingOwners
  });

  // Approve owner mutation
  const approveMutation = useMutation({
    mutationFn: (ownerId: number) => approveOwner(ownerId),
    onSuccess: () => {
      toast({
        title: 'Owner Approved',
        description: 'The owner has been approved successfully.'
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/owners'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/owners/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
    },
    onError: () => {
      toast({
        title: 'Approval Failed',
        description: 'Failed to approve the owner. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Delete owner mutation
  const deleteMutation = useMutation({
    mutationFn: (ownerId: number) => deleteOwner(ownerId),
    onSuccess: () => {
      toast({
        title: 'Owner Deleted',
        description: 'The owner has been deleted successfully.'
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/owners'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/owners/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      setShowDeleteDialog(false);
    },
    onError: () => {
      toast({
        title: 'Deletion Failed',
        description: 'Failed to delete the owner. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleApprove = (owner: Owner) => {
    approveMutation.mutate(owner.id);
  };

  const handleDelete = (owner: Owner) => {
    setSelectedOwner(owner);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedOwner) {
      deleteMutation.mutate(selectedOwner.id);
    }
  };

  const showDetails = (owner: Owner) => {
    setSelectedOwner(owner);
    setShowDetailsDialog(true);
  };

  const renderOwnerTable = (owners: Owner[], showApproveButton = false) => {
    if (owners.length === 0) {
      return (
        <div className="text-center p-8 text-muted-foreground">
          No owners found.
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {owners.map((owner) => (
            <TableRow key={owner.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-2">
                  <img 
                    src={owner.avatarUrl} 
                    alt={owner.name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{owner.name}</span>
                </div>
              </TableCell>
              <TableCell>{owner.type}</TableCell>
              <TableCell>{owner.email}</TableCell>
              <TableCell>
                <Badge variant={owner.isApproved ? "default" : "secondary"}>
                  {owner.isApproved ? "Approved" : "Pending"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => showDetails(owner)}>
                    <IonIcon icon={personCircleOutline} className="w-4 h-4 mr-1" />
                    Details
                  </Button>
                  
                  {showApproveButton && !owner.isApproved && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleApprove(owner)}
                      disabled={approveMutation.isPending}
                    >
                      <IonIcon icon={checkmarkOutline} className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  )}
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => handleDelete(owner)}
                    disabled={deleteMutation.isPending}
                  >
                    <IonIcon icon={trashOutline} className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <AdminLayout title="Owner Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Owner Management</h1>
          <Badge variant="outline">
            {pendingOwners.length} Pending Approval
          </Badge>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Owners</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Approval 
              {pendingOwners.length > 0 && (
                <span className="ml-2 bg-primary/20 text-xs px-2 py-1 rounded-full">
                  {pendingOwners.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Owners</CardTitle>
                <CardDescription>
                  Manage all pet owners in the system.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingAllOwners ? (
                  <div className="text-center p-4">Loading owners...</div>
                ) : (
                  renderOwnerTable(allOwners)
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>
                  These owner accounts are waiting for approval before they can fully use the platform.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingPendingOwners ? (
                  <div className="text-center p-4">Loading pending owners...</div>
                ) : (
                  renderOwnerTable(pendingOwners, true)
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Owner Details Dialog */}
      {selectedOwner && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Owner Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={selectedOwner.avatarUrl} 
                  alt={selectedOwner.name} 
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{selectedOwner.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedOwner.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p>{selectedOwner.type}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p>
                    <Badge variant={selectedOwner.isApproved ? "default" : "secondary"}>
                      {selectedOwner.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </p>
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground text-sm">Bio:</span>
                <p className="mt-1">{selectedOwner.bio}</p>
              </div>
              
              <div>
                <span className="text-muted-foreground text-sm">Joined on:</span>
                <p className="mt-1">
                  {selectedOwner.createdAt ? new Date(selectedOwner.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="ghost" onClick={() => setShowDetailsDialog(false)}>Close</Button>
              <div className="space-x-2">
                {!selectedOwner.isApproved && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleApprove(selectedOwner);
                      setShowDetailsDialog(false);
                    }}
                    disabled={approveMutation.isPending}
                  >
                    <IonIcon icon={checkmarkOutline} className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setShowDetailsDialog(false);
                    setShowDeleteDialog(true);
                  }}
                >
                  <IonIcon icon={trashOutline} className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedOwner && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete owner "{selectedOwner.name}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowDeleteDialog(false)}
              >
                <IonIcon icon={closeOutline} className="w-4 h-4 mr-1" />
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                <IonIcon icon={trashOutline} className="w-4 h-4 mr-1" />
                {deleteMutation.isPending ? "Deleting..." : "Delete Owner"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}
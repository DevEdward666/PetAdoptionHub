import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminPets, updatePet, deletePet } from '@/lib/adminApi';
import { AdminLayout } from '@/components/ui/admin-layout';
import { useToast } from '@/hooks/use-toast';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Pet } from '@shared/schema';
import { IonIcon } from '@ionic/react';
import { pencilOutline, trashOutline, addOutline, closeOutline, imageOutline } from 'ionicons/icons';

export default function AdminPets() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Fetch all pets
  const { 
    data: allPets = [], 
    isLoading: isLoadingPets 
  } = useQuery({
    queryKey: ['/api/admin/pets'],
    queryFn: fetchAdminPets
  });

  // Update pet mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Pet> }) => 
      updatePet(id, data),
    onSuccess: () => {
      toast({
        title: 'Pet Updated',
        description: 'The pet has been updated successfully.'
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pets/showcase'] });
      
      setShowEditDialog(false);
    },
    onError: () => {
      toast({
        title: 'Update Failed',
        description: 'Failed to update the pet. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Delete pet mutation
  const deleteMutation = useMutation({
    mutationFn: (petId: number) => deletePet(petId),
    onSuccess: () => {
      toast({
        title: 'Pet Deleted',
        description: 'The pet has been deleted successfully.'
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/pets/showcase'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      
      setShowDeleteDialog(false);
    },
    onError: () => {
      toast({
        title: 'Deletion Failed',
        description: 'Failed to delete the pet. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleDelete = (pet: Pet) => {
    setSelectedPet(pet);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedPet) {
      deleteMutation.mutate(selectedPet.id);
    }
  };

  const handleEdit = (pet: Pet) => {
    setSelectedPet(pet);
    setShowEditDialog(true);
  };

  const handleStatusChange = (status: string) => {
    if (selectedPet) {
      updateMutation.mutate({
        id: selectedPet.id,
        data: {
          status: status
        }
      });
    }
  };

  const handleAdoptableChange = (adoptable: boolean) => {
    if (selectedPet) {
      updateMutation.mutate({
        id: selectedPet.id,
        data: {
          isAdoptable: adoptable
        }
      });
    }
  };

  const handleFeaturedChange = (featured: boolean) => {
    if (selectedPet) {
      updateMutation.mutate({
        id: selectedPet.id,
        data: {
          isFeatured: featured
        }
      });
    }
  };

  // Filter and search logic
  const filteredPets = allPets.filter((pet) => {
    // Apply type filter
    const typeMatch = filter === 'all' || pet.type === filter;
    
    // Apply search query
    const searchMatch = 
      searchQuery === '' || 
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    
    return typeMatch && searchMatch;
  });

  return (
    <AdminLayout title="Pet Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Pet Management</h1>
          <Button>
            <IonIcon icon={addOutline} className="w-4 h-4 mr-1" />
            Add New Pet
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Pets</CardTitle>
            <CardDescription>
              Manage all pets in the system, both adoptable and showcase pets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="w-full sm:w-1/3">
                <Input
                  placeholder="Search by name or breed..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-1/3">
                <Select 
                  value={filter} 
                  onValueChange={setFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="dog">Dogs</SelectItem>
                    <SelectItem value="cat">Cats</SelectItem>
                    <SelectItem value="bird">Birds</SelectItem>
                    <SelectItem value="small">Small Pets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoadingPets ? (
              <div className="text-center p-4">Loading pets...</div>
            ) : filteredPets.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No pets found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pet</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Adoptable</TableHead>
                      <TableHead>Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPets.map((pet) => (
                      <TableRow key={pet.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                              <img 
                                src={pet.imageUrl} 
                                alt={pet.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div>{pet.name}</div>
                              <div className="text-xs text-muted-foreground">{pet.breed}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{pet.type}</TableCell>
                        <TableCell>{pet.age} years</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              pet.status === 'Available' 
                                ? 'default' 
                                : pet.status === 'Adopted' 
                                  ? 'success' 
                                  : pet.status === 'Pending' 
                                    ? 'warning'
                                    : 'outline'
                            }
                          >
                            {pet.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={pet.isAdoptable ? "default" : "outline"}
                          >
                            {pet.isAdoptable ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={pet.isFeatured ? "secondary" : "outline"}
                          >
                            {pet.isFeatured ? "Featured" : "Regular"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEdit(pet)}
                              disabled={updateMutation.isPending}
                            >
                              <IonIcon icon={pencilOutline} className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDelete(pet)}
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Pet Dialog */}
      {selectedPet && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Pet</DialogTitle>
              <DialogDescription>
                Update the details for {selectedPet.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden border">
                <img 
                  src={selectedPet.imageUrl} 
                  alt={selectedPet.name}
                  className="w-full h-full object-cover"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="absolute bottom-2 right-2 bg-background/80"
                >
                  <IonIcon icon={imageOutline} className="w-4 h-4 mr-1" />
                  Change Image
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select 
                    defaultValue={selectedPet.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Adopted">Adopted</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Not for adoption">Not for adoption</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Adoptable</label>
                  <Select 
                    defaultValue={selectedPet.isAdoptable ? "true" : "false"}
                    onValueChange={(value) => handleAdoptableChange(value === "true")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Featured</label>
                <Select 
                  defaultValue={selectedPet.isFeatured ? "true" : "false"}
                  onValueChange={(value) => handleFeaturedChange(value === "true")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Yes</SelectItem>
                    <SelectItem value="false">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button 
                variant="default" 
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {selectedPet && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedPet.name}? This action cannot be undone.
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
                {deleteMutation.isPending ? "Deleting..." : "Delete Pet"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}
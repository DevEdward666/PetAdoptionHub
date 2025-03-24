import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAdminProducts, updateProduct, deleteProduct } from '@/lib/adminApi';
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
import { Product } from "../../types/schema";
import { IonIcon } from '@ionic/react';
import { 
  pencilOutline, 
  trashOutline, 
  addOutline, 
  closeOutline, 
  imageOutline,
  searchOutline
} from 'ionicons/icons';

// Update the Product interface to include the missing properties
interface ProductWithStock extends Product {
  stock: number;
  isAvailable: boolean;
}

export default function AdminProducts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Fetch all products
  const { 
    data: products = [], 
    isLoading: isLoadingProducts 
  } = useQuery({
    queryKey: ['/api/admin/products'],
    queryFn: fetchAdminProducts
  });

  // Update product mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductWithStock> }) => 
      updateProduct(id, data),
    onSuccess: () => {
      toast({
        title: 'Product Updated',
        description: 'The product has been updated successfully.'
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      
      setShowEditDialog(false);
    },
    onError: () => {
      toast({
        title: 'Update Failed',
        description: 'Failed to update the product. Please try again.',
        variant: 'destructive'
      });
    }
  });

  // Delete product mutation
  const deleteMutation = useMutation({
    mutationFn: (productId: number) => deleteProduct(productId),
    onSuccess: () => {
      toast({
        title: 'Product Deleted',
        description: 'The product has been deleted successfully.'
      });
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      
      setShowDeleteDialog(false);
    },
    onError: () => {
      toast({
        title: 'Deletion Failed',
        description: 'Failed to delete the product. Please try again.',
        variant: 'destructive'
      });
    }
  });

  const handleDelete = (product: ProductWithStock) => {
    setSelectedProduct(product);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.id);
    }
  };

  const handleEdit = (product: ProductWithStock) => {
    setSelectedProduct(product);
    setShowEditDialog(true);
  };

  const handleAvailabilityChange = (available: boolean) => {
    if (selectedProduct) {
      updateMutation.mutate({
        id: selectedProduct.id,
        data: {
          isAvailable: available
        }
      });
    }
  };

  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stockValue = parseInt(e.target.value);
    if (selectedProduct && !isNaN(stockValue)) {
      updateMutation.mutate({
        id: selectedProduct.id,
        data: {
          stock: stockValue
        }
      });
    }
  };
  // Filter and search logic
  const filteredProducts = products.filter((product: ProductWithStock) => {
    // Apply category filter
    const categoryMatch = filter === 'all' || product.category === filter;
    
    // Apply search query
    const searchMatch = 
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  return (
    <AdminLayout title="Product Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Product Management</h1>
          <Button>
            <IonIcon icon={addOutline} className="w-4 h-4 mr-1" />
            Add New Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pet Products</CardTitle>
            <CardDescription>
              Manage all pet products available in the store.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="w-full sm:w-1/3 relative">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                <IonIcon 
                  icon={searchOutline} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"
                />
              </div>
              <div className="w-full sm:w-1/3">
                <Select 
                  value={filter} 
                  onValueChange={setFilter}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="toys">Toys</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                    <SelectItem value="health">Health & Wellness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoadingProducts ? (
              <div className="text-center p-4">Loading products...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                No products found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Pet Type</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product: ProductWithStock) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-muted">
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div>{product.name}</div>
                              <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {product.description}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{product.category}</TableCell>
                        <TableCell className="capitalize">{product.petType}</TableCell>
                        <TableCell>${product.price}</TableCell>
                        <TableCell>
                          {product.stock > 10 ? (
                            <span>{product.stock}</span>
                          ) : product.stock > 0 ? (
                            <Badge variant="secondary">Low: {product.stock}</Badge>
                          ) : (
                            <Badge variant="destructive">Out of stock</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={product.isAvailable ? "default" : "destructive"}
                          >
                            {product.isAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEdit(product)}
                              disabled={updateMutation.isPending}
                            >
                              <IonIcon icon={pencilOutline} className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              onClick={() => handleDelete(product)}
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

      {/* Edit Product Dialog */}
      {selectedProduct && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the details for {selectedProduct.name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden border">
                <img 
                  src={selectedProduct.imageUrl} 
                  alt={selectedProduct.name}
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
                  <label className="text-sm font-medium">Price ($)</label>
                  <Input 
                    type="number" 
                    step="0.01" 
                    defaultValue={selectedProduct.price} 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Stock</label>
                  <Input 
                    type="number" 
                    defaultValue={selectedProduct.stock} 
                    onChange={handleStockChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Available for Sale</label>
                <Select 
                  defaultValue={selectedProduct.isAvailable ? "true" : "false"}
                  onValueChange={(value) => handleAvailabilityChange(value === "true")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
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
      {selectedProduct && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{selectedProduct.name}"? This action cannot be undone.
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
                {deleteMutation.isPending ? "Deleting..." : "Delete Product"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}
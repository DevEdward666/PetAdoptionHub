import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription, Form } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { DialogFooter } from "@/components/ui/dialog";
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertAdmin, insertAdminSchema, InsertOwner, insertUserchema } from "@shared/schema";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createOwner } from "@/lib/adminApi";

export default function Register() {
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [showAddDialog, setShowAddDialog] = useState(false);
  
    // Fetch all admins
    // const { 
    //   data: admins = [], 
    //   isLoading: isLoadingAdmins 
    // } = useQuery({
    //   queryKey: ['/api/admin/admins'],
    //   queryFn: fetchAdmins
    // });
  
    // Create admin mutation
    const createMutation = useMutation({
      mutationFn: (ownerData: InsertOwner) => createOwner(ownerData),
      onSuccess: () => {
        toast({
          title: 'User Created',
          description: 'The user has been created successfully.'
        });
        // Invalidate relevant queries
        // queryClient.invalidateQueries({ queryKey: ['/api/owner/admins'] });
        setShowAddDialog(false);
        form.reset();
      },
      onError: (error: any) => {
        toast({
          title: 'Creation Failed',
          description: error?.message || 'Failed to create user. Please try again.',
          variant: 'destructive'
        });
      }
    });
  
    // Form setup
    const form = useForm<InsertOwner>({
      resolver: zodResolver(insertUserchema),
      defaultValues: {
        password: '',
        name: '',
        email: '',
        type: 'pet_owner',
        bio: '',
        avatarUrl: '',
      }
    });
  
    const onSubmit = (data: InsertOwner) => {
      createMutation.mutate(data);
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
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full Name</FormLabel>
            <FormControl>
              <Input placeholder="John Doe" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      
      
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Min. 6 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pet_owner">Pet Owner</SelectItem>
                  <SelectItem value="pet_rescuer">Pet Rescuer</SelectItem>
                  <SelectItem value="pet_foster">Pet Foster</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
<div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          type="button"
          onClick={() => setShowAddDialog(false)}
        >
          <IonIcon icon={closeOutline} className="w-4 h-4 mr-1" />
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Processing..." : "Register"}
        </Button>
        </div>
    </form>
    </Form>
    </IonContent>
    </IonPage>
    )
}
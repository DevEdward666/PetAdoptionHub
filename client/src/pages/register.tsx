import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription, Form } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { InsertOwner, insertUserchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { createOwner } from "@/lib/adminApi";
import { useLocation } from "wouter";

export default function Register() {
    const { toast } = useToast();
    const [, setLocation] = useLocation();
  
    // Create owner mutation
    const createMutation = useMutation({
      mutationFn: (ownerData: InsertOwner) => createOwner(ownerData),
      onSuccess: () => {
        toast({
          title: 'Registration Successful',
          description: 'Your account has been created successfully.'
        });
        // Navigate to login page
        setLocation("/");
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || 'Failed to create user. Please try again.';
        toast({
          title: 'Registration Failed',
          description: errorMessage,
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
  
    const onSubmit = async (data: InsertOwner) => {
      try {
        // Fields to exclude from empty validation
        const excludedFields = ['bio', 'avatarUrl', 'isApproved', 'createdAt', 'updatedAt'];
        
        // Check for empty fields
        const emptyFields = Object.entries(data)
          .filter(([key, value]) => {
            // Skip excluded fields
            if (excludedFields.includes(key)) return false;
            
            if (typeof value === 'string') {
              return !value || value.trim() === '';
            }
            return !value;
          })
          .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

        if (emptyFields.length > 0) {
          emptyFields.forEach(field => {
            toast({
              title: 'Validation Error',
              description: `${field} cannot be empty`,
              variant: 'destructive'
            });
          });
          return;
        }

        await createMutation.mutateAsync(data);
      } catch (error: any) {
        if (error?.message.includes("Email already exists")) {
          toast({
            title: 'Registration Failed',
            description: 'Email already exists',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Registration Failed',
            description: 'Failed to create user. Please try again.',
            variant: 'destructive'
          });
        }
      }
    };

    return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonBackButton defaultHref="/" />
              </IonButtons>
              <IonTitle>Register</IonTitle>
            </IonToolbar>
          </IonHeader>
          
          <IonContent className="ion-padding">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    onClick={() => setLocation("/")}
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
    );
}
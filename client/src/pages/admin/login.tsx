import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AdminLogin as AdminLoginType, adminLoginSchema, Admin } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/store/AdminContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IonContent, IonPage, IonIcon } from "@ionic/react";
import { lockClosedOutline } from "ionicons/icons";
import { Admin as LocalAdmin } from "../../types/schema";

interface LoginResponse {
  token: string;
  admin: Admin;
}

export default function AdminLogin() {
  const [_, setLocation] = useLocation();
  const { login } = useAdmin();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AdminLoginType>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: AdminLoginType) => {
      const response = await apiRequest("POST", "/api/admin/login", data);
      return response.json() as Promise<LoginResponse>;
    },
    onSuccess: (data) => {
      // Use the login function from context
      login(data.token, data.admin);
      
      toast({
        title: "Login Successful",
        description: "Welcome to the admin dashboard."
      });
      
      // Navigate to admin dashboard
      setLocation("/admin/dashboard");
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Invalid username or password. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  });

  const onSubmit = (data: AdminLoginType) => {
    setIsLoading(true);
    mutation.mutate(data);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <IonIcon icon={lockClosedOutline} className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center font-bold">Admin Login</CardTitle>
              <CardDescription className="text-center">
                Enter your credentials to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="admin" {...field} />
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
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button 
                variant="link" 
                onClick={() => setLocation("/")}
                className="text-sm"
              >
                Return to Main App
              </Button>
            </CardFooter>
          </Card>
        </div>
      </IonContent>
    </IonPage>
  );
}
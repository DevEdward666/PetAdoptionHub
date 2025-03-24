import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ReportCrueltySchema, reportCrueltySchema } from "@shared/schema";

export default function ReportCruelty() {
  const { toast } = useToast();
  const [isAnonymous, setIsAnonymous] = useState(false);

  const form = useForm<ReportCrueltySchema>({
    resolver: zodResolver(reportCrueltySchema),
    defaultValues: {
      type: "",
      location: "",
      description: "",
      contactInfo: "",
      anonymous: false,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ReportCrueltySchema) => {
      await apiRequest("POST", "/api/reports", data);
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Thank you for reporting. Your submission helps protect animals.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReportCrueltySchema) => {
    mutate(data);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-['Nunito'] font-bold text-xl mb-2">Report Pet Cruelty</h2>
        <p className="text-sm text-gray-600">Help us protect animals from abuse and neglect by reporting incidents of cruelty.</p>
      </div>
      
      {/* Report Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white rounded-[12px] shadow-sm p-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-sm font-semibold">Type of Incident*</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full p-2 border border-gray-300 rounded-lg text-sm">
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="neglect">Animal Neglect</SelectItem>
                    <SelectItem value="physical">Physical Abuse</SelectItem>
                    <SelectItem value="abandonment">Abandonment</SelectItem>
                    <SelectItem value="hoarding">Animal Hoarding</SelectItem>
                    <SelectItem value="dogfighting">Dog Fighting</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-[#DC3545] text-xs mt-1" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-sm font-semibold">Location*</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Address or location description" 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[#DC3545] text-xs mt-1" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="mb-4">
                <FormLabel className="block text-sm font-semibold">Description*</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Please provide details about the incident" 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-[#DC3545] text-xs mt-1" />
              </FormItem>
            )}
          />
          
          <div className="mb-4">
            <FormLabel className="block text-sm font-semibold mb-1">Evidence Photos (Optional)</FormLabel>
            <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
              <i className="ri-camera-line text-2xl text-gray-400 mb-1"></i>
              <p className="text-sm text-gray-500 mb-2">Upload photos as evidence</p>
              <Button 
                type="button" 
                variant="secondary" 
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300"
              >
                Add Photos
              </Button>
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="contactInfo"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel className="block text-sm font-semibold">Your Contact Info (Optional)</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Email or phone number" 
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                    disabled={isAnonymous}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-gray-500 mt-1">
                  Your information will be kept confidential.
                </FormDescription>
                <FormMessage className="text-[#DC3545] text-xs mt-1" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="anonymous"
            render={({ field }) => (
              <FormItem className="mb-4">
                <div className="flex items-center">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        setIsAnonymous(!!checked);
                        if (checked) {
                          form.setValue("contactInfo", "");
                        }
                      }}
                    />
                  </FormControl>
                  <FormLabel className="ml-2 text-sm">
                    Submit report anonymously
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-[#DC3545] text-white py-3 rounded-lg font-semibold text-sm hover:bg-[#c82333]"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </Form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          For emergencies, please call Animal Protection Hotline:
        </p>
        <p className="font-semibold text-[#DC3545]">(082)  241-1000 </p>
      </div>
    </div>
  );
}

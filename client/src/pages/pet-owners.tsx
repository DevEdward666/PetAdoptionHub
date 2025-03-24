import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { OwnerCard } from "@/components/ui/owner-card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Owner, Pet } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function PetOwners() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch owners data
  const { data: owners, isLoading: ownersLoading } = useQuery<Owner[]>({
    queryKey: ['/api/owners'],
  });

  // Fetch pets data
  const { data: pets, isLoading: petsLoading } = useQuery<Pet[]>({
    queryKey: ['/api/pets'],
  });

  const isLoading = ownersLoading || petsLoading;

  const handleViewProfile = () => {
    toast({
      title: "Profile Viewed",
      description: "You're viewing the owner's profile.",
    });
  };

  // Filter owners based on search term
  const filteredOwners = owners?.filter(owner => 
    owner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get pets for each owner
  const getPetsForOwner = (ownerId: number) => {
    return pets?.filter(pet => pet.ownerId === ownerId) || [];
  };

  return (
    <div>
      <h2 className="font-['Nunito'] font-bold text-xl mb-4">Pet Owners</h2>
      
      {/* Search for owners */}
      <div className="bg-white p-3 rounded-[12px] shadow-sm mb-4">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
          <Input
            type="text"
            placeholder="Search pet owners..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Owner Cards */}
      {isLoading ? (
        // Skeleton loading state
        Array(2).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-[12px] shadow-sm mb-4 overflow-hidden">
            <div className="p-4">
              <div className="flex items-center mb-3">
                <Skeleton className="w-14 h-14 rounded-full" />
                <div className="ml-3">
                  <Skeleton className="h-5 w-32 mb-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-3" />
              <Skeleton className="h-4 w-full mb-3" />
              <div className="flex gap-2 mb-3">
                <Skeleton className="w-16 h-16 rounded-lg" />
                <Skeleton className="w-16 h-16 rounded-lg" />
                <Skeleton className="w-16 h-16 rounded-lg" />
              </div>
              <Skeleton className="h-10 w-full rounded-full" />
            </div>
          </div>
        ))
      ) : (
        filteredOwners?.map(owner => (
          <OwnerCard
            key={owner.id}
            owner={owner}
            pets={getPetsForOwner(owner.id)}
            onViewProfile={handleViewProfile}
          />
        ))
      )}

      {/* Empty state */}
      {!isLoading && filteredOwners?.length === 0 && (
        <div className="text-center py-8">
          <i className="ri-user-search-line text-4xl text-gray-400 mb-2"></i>
          <p className="text-gray-500">No owners found matching your search.</p>
        </div>
      )}
    </div>
  );
}

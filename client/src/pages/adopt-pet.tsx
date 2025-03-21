import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { PetCard } from "@/components/ui/pet-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Pet } from "@shared/schema";

export default function AdoptPet() {
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState("all");
  const [favorites, setFavorites] = useState<number[]>([]);

  // Fetch pets data
  const { data: pets, isLoading } = useQuery<Pet[]>({
    queryKey: ['/api/pets'],
  });

  const handleAdoptClick = (petId: number) => {
    toast({
      title: "Adoption Request Sent",
      description: "The owner will be notified of your interest.",
    });
  };

  const handleFavoriteClick = (petId: number) => {
    setFavorites(prev => 
      prev.includes(petId) 
        ? prev.filter(id => id !== petId) 
        : [...prev, petId]
    );
  };

  const filteredPets = pets?.filter(pet => {
    if (activeFilter === "all") return true;
    return pet.type.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 bg-white p-3 rounded-[12px] shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-['Nunito'] font-bold text-lg">Find Your Match</h2>
          <button className="text-primary flex items-center text-sm">
            <i className="ri-filter-3-line mr-1"></i> Filters
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          <button 
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${activeFilter === "all" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveFilter("all")}
          >
            All Pets
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${activeFilter === "dog" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveFilter("dog")}
          >
            Dogs
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${activeFilter === "cat" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveFilter("cat")}
          >
            Cats
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${activeFilter === "bird" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveFilter("bird")}
          >
            Birds
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${activeFilter === "small" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"}`}
            onClick={() => setActiveFilter("small")}
          >
            Small Pets
          </button>
        </div>
      </div>

      {/* Pet Listings */}
      {isLoading ? (
        // Skeleton loading state
        Array(3).fill(0).map((_, index) => (
          <div key={index} className="bg-white rounded-[12px] shadow-sm mb-4 overflow-hidden">
            <Skeleton className="w-full h-[180px]" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex justify-between">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            </div>
          </div>
        ))
      ) : (
        filteredPets?.map(pet => (
          <PetCard
            key={pet.id}
            pet={pet}
            onAdoptClick={handleAdoptClick}
            onFavoriteClick={handleFavoriteClick}
            isFavorited={favorites.includes(pet.id)}
          />
        ))
      )}

      {/* Empty state */}
      {!isLoading && filteredPets?.length === 0 && (
        <div className="text-center py-8">
          <i className="ri-emotion-sad-line text-4xl text-gray-400 mb-2"></i>
          <p className="text-gray-500">No pets found matching your filter.</p>
        </div>
      )}
    </div>
  );
}

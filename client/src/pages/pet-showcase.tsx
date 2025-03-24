import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ShowcaseCard } from "@/components/ui/showcase-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pet } from "../types/schema";
import { useToast } from "@/hooks/use-toast";
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { pawOutline, searchOutline, notificationsOutline } from "ionicons/icons";

export default function PetShowcase() {
  const { toast } = useToast();
  const [filter, setFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch showcase pets
  const { data: showcasePets, isLoading } = useQuery<Pet[]>({
    queryKey: ['/api/pets/showcase'],
  });

  const handleLike = () => {
    toast({
      title: "Liked!",
      description: "You've liked this pet.",
    });
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  // Filter pets based on selected filter
  const filteredPets = showcasePets?.filter(pet => {
    if (filter === "all") return true;
    if (filter === "mostLiked") return pet.likes ? pet.likes > 150 : false;
    if (filter === "recent") return pet.isRecent;
    if (filter === "featured") return pet.isFeatured;
    return true;
  });

  // Limit the number of visible pets
  const visiblePets = filteredPets?.slice(0, visibleCount);

  return (
    <IonPage>
       <IonHeader>
        <IonToolbar>
          <div className="flex items-center px-2" slot="start">
            <IonIcon icon={pawOutline} className="text-primary text-2xl mr-2" />
            <IonTitle>Pawfect Match</IonTitle>
          </div>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon slot="icon-only" icon={searchOutline} />
            </IonButton>
            <IonButton>
              <IonIcon slot="icon-only" icon={notificationsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
    <div>
      <h2 className="font-['Nunito'] font-bold text-xl mb-4">Pet Showcase</h2>
      
      {/* Showcase Filters */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4">
        <button 
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${filter === "all" ? "bg-[#4ECDC4] text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setFilter("all")}
        >
          All Pets
        </button>
        <button 
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${filter === "mostLiked" ? "bg-[#4ECDC4] text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setFilter("mostLiked")}
        >
          Most Liked
        </button>
        <button 
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${filter === "recent" ? "bg-[#4ECDC4] text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setFilter("recent")}
        >
          Recent
        </button>
        <button 
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${filter === "featured" ? "bg-[#4ECDC4] text-white" : "bg-gray-200 text-gray-700"}`}
          onClick={() => setFilter("featured")}
        >
          Featured
        </button>
      </div>
      
      {/* Showcase Grid */}
      {isLoading ? (
        // Skeleton loading state
        <div className="grid grid-cols-2 gap-3 mb-4">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-[12px] shadow-sm overflow-hidden">
              <Skeleton className="w-full h-32" />
              <div className="p-2">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {visiblePets?.map(pet => (
            <ShowcaseCard
              key={pet.id}
              pet={pet}
              onLike={handleLike}
            />
          ))}
        </div>
      )}
      
      {/* Load more button */}
      {!isLoading && filteredPets && visibleCount < filteredPets.length && (
        <Button 
          variant="outline" 
          className="w-full bg-white border border-[#4ECDC4] text-[#4ECDC4] py-2 rounded-full text-sm font-semibold"
          onClick={handleLoadMore}
        >
          Load More
        </Button>
      )}

      {/* Empty state */}
      {!isLoading && (!filteredPets || filteredPets.length === 0) && (
        <div className="text-center py-8">
          <i className="ri-gallery-line text-4xl text-gray-400 mb-2"></i>
          <p className="text-gray-500">No showcase pets found.</p>
        </div>
      )}
    </div>
    </IonContent>
    </IonPage>
  );
}

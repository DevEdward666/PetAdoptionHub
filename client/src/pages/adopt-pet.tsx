import { useToast } from "@/hooks/use-toast";
import { PetCard } from "@/components/ui/pet-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "../store/AppContext";
import { 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonChip,
  IonLabel,
  IonIcon,
  IonButton,
  IonSearchbar,
  IonGrid,
  IonRow
} from "@ionic/react";
import { filterOutline, sadOutline } from "ionicons/icons";

export default function AdoptPet() {
  const { toast } = useToast();
  const { 
    state, 
    setActiveFilter, 
    toggleFavorite, 
    getFilteredPets 
  } = useAppContext();

  const handleAdoptClick = (petId: number) => {
    toast({
      title: "Adoption Request Sent",
      description: "The owner will be notified of your interest.",
    });
  };

  const filteredPets = getFilteredPets();
  const isLoading = state.isLoading.pets;

  return (
    <div>
      {/* Filters */}
      <IonCard className="mb-4">
        <IonCardHeader>
          <div className="flex justify-between items-center">
            <IonCardTitle className="text-lg font-bold">Find Your Match</IonCardTitle>
            <IonButton fill="clear" size="small">
              <IonIcon slot="start" icon={filterOutline} />
              Filters
            </IonButton>
          </div>
        </IonCardHeader>
        
        <IonCardContent>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            <IonChip 
              color={state.activeFilter === "all" ? "primary" : "medium"}
              onClick={() => setActiveFilter("all")}
            >
              <IonLabel>All Pets</IonLabel>
            </IonChip>
            <IonChip 
              color={state.activeFilter === "dog" ? "primary" : "medium"}
              onClick={() => setActiveFilter("dog")}
            >
              <IonLabel>Dogs</IonLabel>
            </IonChip>
            <IonChip 
              color={state.activeFilter === "cat" ? "primary" : "medium"}
              onClick={() => setActiveFilter("cat")}
            >
              <IonLabel>Cats</IonLabel>
            </IonChip>
            <IonChip 
              color={state.activeFilter === "bird" ? "primary" : "medium"}
              onClick={() => setActiveFilter("bird")}
            >
              <IonLabel>Birds</IonLabel>
            </IonChip>
            <IonChip 
              color={state.activeFilter === "small" ? "primary" : "medium"}
              onClick={() => setActiveFilter("small")}
            >
              <IonLabel>Small Pets</IonLabel>
            </IonChip>
          </div>
        </IonCardContent>
      </IonCard>

      {/* Search */}
      <IonSearchbar 
        placeholder="Search by name, breed..." 
        className="mb-4" 
        animated={true}
      ></IonSearchbar>

      {/* Pet Listings */}
      <IonGrid>
        <IonRow>
          {isLoading ? (
            // Skeleton loading state
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="w-full mb-4">
                <IonCard>
                  <Skeleton className="w-full h-[180px]" />
                  <IonCardContent>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </IonCardContent>
                </IonCard>
              </div>
            ))
          ) : (
            filteredPets.map(pet => (
              <PetCard
                key={pet.id}
                pet={pet}
                onAdoptClick={handleAdoptClick}
                onFavoriteClick={toggleFavorite}
                isFavorited={state.favorites.includes(pet.id)}
              />
            ))
          )}
        </IonRow>
      </IonGrid>

      {/* Empty state */}
      {!isLoading && filteredPets.length === 0 && (
        <div className="text-center py-8">
          <IonIcon icon={sadOutline} className="text-4xl text-gray-400 mb-2" />
          <p className="text-gray-500">No pets found matching your filter.</p>
          <IonButton 
            fill="clear" 
            onClick={() => setActiveFilter("all")}
          >
            Clear Filter
          </IonButton>
        </div>
      )}
    </div>
  );
}

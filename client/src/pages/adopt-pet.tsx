import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pet } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonRange,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonModal
} from "@ionic/react";
import { 
  logOutOutline, 
  heartOutline, 
  settingsOutline, 
  helpCircleOutline,
  personCircleOutline,
  mailOutline,
  locationOutline
} from 'ionicons/icons';
import { PetCard } from "@/components/ui/pet-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppContext } from "../store/AppContext";
import { 
  IonCardHeader, 
  IonCardTitle, 
  IonChip,
} from "@ionic/react";
import { 
  filterOutline, 
  sadOutline,
  pawOutline,
  starOutline,
  diamondOutline,
  sparklesOutline,
  closeOutline
} from "ionicons/icons";

interface Filters {
  type: string;
  age: string;
  size: string;
  gender: string;
}

export default function AdoptPet() {
  const { toast } = useToast();
  const { 
    state, 
    setActiveFilter, 
    toggleFavorite, 
    getFilteredPets,
    dispatch
  } = useAppContext();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<Filters>({
    type: 'all',
    age: 'any',
    size: 'any',
    gender: 'any'
  });

  const handleAdoptClick = (petId: number) => {
    toast({
      title: "Adoption Request Sent",
      description: "The owner will be notified of your interest.",
    });
  };

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setTempFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyFilters = () => {
    // Update each filter individually
    Object.entries(tempFilters).forEach(([key, value]) => {
      dispatch({ type: 'SET_FILTERS', payload: { key, value } });
    });
    setIsFilterModalOpen(false);
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
    setTempFilters({
      type: 'all',
      age: 'any',
      size: 'any',
      gender: 'any'
    });
  };

  const filteredPets = getFilteredPets();
  const isLoading = state.isLoading.pets;

  const filterPets = (pets: Pet[]) => {
    return pets.filter(pet => {
      if (tempFilters.type && tempFilters.type !== 'all' && pet.type !== tempFilters.type) return false;
      if (tempFilters.age && tempFilters.age !== 'any' && pet.age > Number(tempFilters.age)) return false;
      if (tempFilters.gender && tempFilters.gender !== 'any' && pet.gender !== tempFilters.gender) return false;
      if (tempFilters.size && tempFilters.size !== 'any' && pet.size !== tempFilters.size) return false;
      return true;
    });
  };

  return (
    <div>
      {/* Filters */}
      <IonCard className="mb-4">
        <IonCardHeader>
          <div className="flex justify-between items-center">
            <IonCardTitle className="text-lg font-bold">Find Your Match</IonCardTitle>
            <IonButton fill="clear" size="small" onClick={() => setIsFilterModalOpen(true)}>
              <IonIcon slot="start" icon={filterOutline} />
              Filters
            </IonButton>
          </div>
        </IonCardHeader>
      </IonCard>

      {/* Filter Modal */}
      <IonModal isOpen={isFilterModalOpen} onDidDismiss={() => setIsFilterModalOpen(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Filter Pets</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsFilterModalOpen(false)}>
                <IonIcon icon={closeOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonList>
            <IonItem>
              <IonLabel>Pet Type</IonLabel>
              <IonSelect
                value={tempFilters.type}
                onIonChange={e => handleFilterChange('type', e.detail.value)}
              >
                <IonSelectOption value="all">All Pets</IonSelectOption>
                <IonSelectOption value="dog">Dogs</IonSelectOption>
                <IonSelectOption value="cat">Cats</IonSelectOption>
                <IonSelectOption value="bird">Birds</IonSelectOption>
                <IonSelectOption value="small">Small Pets</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel>Age Range</IonLabel>
              <IonSelect
                value={tempFilters.age}
                onIonChange={e => handleFilterChange('age', e.detail.value)}
              >
                <IonSelectOption value="any">Any Age</IonSelectOption>
                <IonSelectOption value="young">Young (0-1 year)</IonSelectOption>
                <IonSelectOption value="adult">Adult (1-7 years)</IonSelectOption>
                <IonSelectOption value="senior">Senior (7+ years)</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel>Size</IonLabel>
              <IonSelect
                value={tempFilters.size}
                onIonChange={e => handleFilterChange('size', e.detail.value)}
              >
                <IonSelectOption value="any">Any Size</IonSelectOption>
                <IonSelectOption value="small">Small</IonSelectOption>
                <IonSelectOption value="medium">Medium</IonSelectOption>
                <IonSelectOption value="large">Large</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonItem>
              <IonLabel>Gender</IonLabel>
              <IonSelect
                value={tempFilters.gender}
                onIonChange={e => handleFilterChange('gender', e.detail.value)}
              >
                <IonSelectOption value="any">Any Gender</IonSelectOption>
                <IonSelectOption value="male">Male</IonSelectOption>
                <IonSelectOption value="female">Female</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>

          <div className="ion-padding">
            <IonButton expand="block" onClick={applyFilters}>
              Apply Filters
            </IonButton>
            <IonButton expand="block" fill="clear" onClick={resetFilters}>
              Reset Filters
            </IonButton>
          </div>
        </IonContent>
      </IonModal>

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

import { Pet } from "@shared/schema";
import { 
  IonCard, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle,
  IonButton,
  IonIcon,
  IonChip,
  IonAvatar,
  IonLabel,
  IonText
} from "@ionic/react";
import { heartOutline, heartSharp } from "ionicons/icons";
import { Link } from "wouter";

interface PetCardProps {
  pet: Pet;
  onAdoptClick: (petId: number) => void;
  onFavoriteClick: (petId: number) => void;
  isFavorited: boolean;
}

export function PetCard({ pet, onAdoptClick, onFavoriteClick, isFavorited }: PetCardProps) {
  return (
    <Link href={`/pet/${pet.id}`}>
      <IonCard className="pet-card mb-4 overflow-hidden w-full cursor-pointer hover:shadow-md transition-shadow">
        <img 
          src={pet.imageUrl} 
          alt={`${pet.name} - ${pet.breed}`} 
          className="w-full h-[180px] object-contain"
        />
        <IonCardHeader>
          <div className="flex justify-between items-start">
            <div>
              <IonCardTitle className="font-bold">{pet.name}</IonCardTitle>
              <IonCardSubtitle>{pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'}</IonCardSubtitle>
            </div>
            <IonChip color="warning">
              <IonLabel>{pet.status}</IonLabel>
            </IonChip>
          </div>
        </IonCardHeader>
        
        <IonCardContent>
          <IonText color="medium" className="mb-3 block">
            {pet.description}
          </IonText>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <IonAvatar style={{ width: '24px', height: '24px' }}>
                <img src={pet.ownerAvatarUrl} alt={`${pet.ownerName}'s avatar`} />
              </IonAvatar>
              <IonText color="medium" className="ml-2 text-xs">
                {pet.ownerName}'s Pet
              </IonText>
            </div>
            
            <div className="flex gap-2">
              <IonButton 
                fill="clear" 
                onClick={(e) => {
                  e.preventDefault();
                  onFavoriteClick(pet.id);
                }}
                className="m-0"
              >
                <IonIcon 
                  icon={isFavorited ? heartSharp : heartOutline} 
                  color={isFavorited ? "primary" : "medium"} 
                  slot="icon-only"
                />
              </IonButton>
              
              <IonButton 
                size="small" 
                onClick={(e) => {
                  e.preventDefault();
                  onAdoptClick(pet.id);
                }}
              >
                Adopt Me
              </IonButton>
            </div>
          </div>
        </IonCardContent>
      </IonCard>
    </Link>
  );
}

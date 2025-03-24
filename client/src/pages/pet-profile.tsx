import { useParams } from 'wouter';
import { useAppContext } from '../store/AppContext';
import { 
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel,
  IonList,
  IonItem,
  IonAvatar,
  IonSkeletonText,
  IonBackButton,
  IonActionSheet
} from '@ionic/react';
import { 
  heartOutline, 
  heart,
  callOutline,
  mailOutline,
  locationOutline,
  calendarOutline,
  pawOutline,
  peopleOutline,
  scaleOutline,
  maleOutline,
  femaleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  shareOutline,
  flagOutline,
  imagesOutline,
  mapOutline
} from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { Pet, Owner } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export default function PetProfile() {
  const params = useParams();
  const { state, toggleFavorite } = useAppContext();
  const { toast } = useToast();
  const [pet, setPet] = useState<Pet | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showReportSheet, setShowReportSheet] = useState(false);
  const petId = parseInt(params?.id || '0');

  useEffect(() => {
    const fetchPetData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/pets/${petId}`);
        if (!response.ok) {
          throw new Error('Pet not found');
        }
        const petData = await response.json();
        setPet(petData);
        
        // Fetch owner data if we have the owner ID
        if (petData.ownerId) {
          const ownerResponse = await fetch(`/api/owners/${petData.ownerId}`);
          if (ownerResponse.ok) {
            const ownerData = await ownerResponse.json();
            setOwner(ownerData);
          }
        }
      } catch (error) {
        console.error('Error fetching pet data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (petId) {
      fetchPetData();
    }
  }, [petId]);

  const getSimilarPets = () => {
    if (!pet) return [];
    return state.pets
      .filter(p => p.id !== pet.id && p.type === pet.type)
      .slice(0, 3);
  };

  const handleShare = () => {
    setShowShareSheet(true);
  };

  const handleReport = () => {
    setShowReportSheet(true);
  };

  if (isLoading) {
    return (
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home/main" />
            </IonButtons>
            <IonTitle>Pet Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding">
          <IonSkeletonText animated style={{ width: '100%', height: '200px' }} />
          <IonSkeletonText animated style={{ width: '60%', height: '30px' }} />
          <IonSkeletonText animated style={{ width: '40%', height: '20px' }} />
        </div>
      </IonContent>
    );
  }

  if (!pet) {
    return (
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home/main" />
            </IonButtons>
            <IonTitle>Pet Not Found</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="ion-padding text-center">
          <p>Sorry, this pet could not be found.</p>
        </div>
      </IonContent>
    );
  }

  return (
    <IonContent>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home/main" />
          </IonButtons>
          <IonTitle>Pet Profile</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleShare}>
              <IonIcon slot="icon-only" icon={shareOutline} />
            </IonButton>
            <IonButton onClick={handleReport}>
              <IonIcon slot="icon-only" icon={flagOutline} />
            </IonButton>
            <IonButton onClick={() => toggleFavorite(pet.id)}>
              <IonIcon 
                slot="icon-only" 
                icon={state.favorites.includes(pet.id) ? heart : heartOutline} 
                color={state.favorites.includes(pet.id) ? 'danger' : 'medium'} 
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <div className="ion-padding">
        {/* Pet Image */}
        <IonCard>
          <div className="relative">
            <img 
              src={pet.imageUrl} 
              alt={pet.name}
              className="w-full h-[300px] object-cover"
            />
            {/* {pet.gallery && pet.gallery.length > 0 && (
              <IonButton 
                className="absolute bottom-2 right-2 bg-black bg-opacity-50"
                onClick={() => toast({ title: "Coming Soon", description: "Gallery feature coming soon!" })}
              >
                <IonIcon icon={imagesOutline} slot="start" />
                <IonLabel>View Gallery</IonLabel>
              </IonButton>
            )} */}
          </div>
        </IonCard>

        {/* Pet Info */}
        <IonCard className="mt-4">
          <IonCardHeader>
            <IonCardTitle className="text-2xl font-bold">{pet.name}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <IonChip color="primary">
                <IonIcon icon={pawOutline} />
                <IonLabel>{pet.type}</IonLabel>
              </IonChip>
              <IonChip color="secondary">
                <IonIcon icon={calendarOutline} />
                <IonLabel>{pet.age} years</IonLabel>
              </IonChip>
              <IonChip color="tertiary">
                <IonIcon icon={scaleOutline} />
                <IonLabel>{pet.size}</IonLabel>
              </IonChip>
              <IonChip color="success">
                <IonIcon icon={pet.gender === 'male' ? maleOutline : femaleOutline} />
                <IonLabel>{pet.gender}</IonLabel>
              </IonChip>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-gray-600">{pet.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Characteristics</h3>
                <IonList>
                  <IonItem>
                    <IonIcon slot="start" icon={pawOutline} />
                    <IonLabel>Breed</IonLabel>
                    <IonLabel slot="end">{pet.breed}</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonIcon slot="start" icon={calendarOutline} />
                    <IonLabel>Status</IonLabel>
                    <IonLabel slot="end" color={pet.isAdoptable ? 'success' : 'medium'}>
                      {pet.isAdoptable ? 'Available for Adoption' : 'Not Available'}
                    </IonLabel>
                  </IonItem>
                </IonList>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Owner Info */}
        {owner && (
          <IonCard className="mt-4">
            <IonCardHeader>
              <IonCardTitle className="text-xl font-bold">Owner Information</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="flex items-center space-x-4 mb-4">
                <IonAvatar>
                  <img src={owner.avatarUrl} alt={owner.name} />
                </IonAvatar>
                <div>
                  <h3 className="text-lg font-semibold">{owner.name}</h3>
                  <p className="text-gray-600">Member since {owner.createdAt ? new Date(owner.createdAt).getFullYear() : 'N/A'}</p>
                </div>
              </div>

              <IonList>
                <IonItem>
                  <IonIcon slot="start" icon={mailOutline} />
                  <IonLabel>Email</IonLabel>
                  <IonLabel slot="end">{owner.email}</IonLabel>
                </IonItem>
                <IonItem>
                  <IonIcon slot="start" icon={locationOutline} />
                  <IonLabel>Bio</IonLabel>
                  <IonLabel slot="end">{owner.bio}</IonLabel>
                </IonItem>
              </IonList>

              <IonButton expand="block" className="mt-4">
                Contact Owner
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {/* Similar Pets */}
        {getSimilarPets().length > 0 && (
          <IonCard className="mt-4">
            <IonCardHeader>
              <IonCardTitle className="text-xl font-bold">Similar Pets</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <div className="grid grid-cols-3 gap-4">
                {getSimilarPets().map(similarPet => (
                  <div key={similarPet.id} className="cursor-pointer" onClick={() => window.location.href = `/pet/${similarPet.id}`}>
                    <img 
                      src={similarPet.imageUrl} 
                      alt={similarPet.name}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <p className="text-sm mt-1 font-medium">{similarPet.name}</p>
                  </div>
                ))}
              </div>
            </IonCardContent>
          </IonCard>
        )}
      </div>

      {/* Share Action Sheet */}
      <IonActionSheet
        isOpen={showShareSheet}
        onDidDismiss={() => setShowShareSheet(false)}
        buttons={[
          {
            text: 'Share via Link',
            handler: () => {
              navigator.clipboard.writeText(window.location.href);
              toast({
                title: "Link Copied",
                description: "Pet profile link copied to clipboard!",
              });
            }
          },
          {
            text: 'Share on Social Media',
            handler: () => {
              toast({
                title: "Coming Soon",
                description: "Social media sharing coming soon!",
              });
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]}
      />

      {/* Report Action Sheet */}
      <IonActionSheet
        isOpen={showReportSheet}
        onDidDismiss={() => setShowReportSheet(false)}
        buttons={[
          {
            text: 'Report Inappropriate Content',
            handler: () => {
              toast({
                title: "Report Submitted",
                description: "Thank you for helping us maintain a safe community.",
              });
            }
          },
          {
            text: 'Report False Information',
            handler: () => {
              toast({
                title: "Report Submitted",
                description: "We'll review the information and make necessary corrections.",
              });
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]}
      />
    </IonContent>
  );
} 
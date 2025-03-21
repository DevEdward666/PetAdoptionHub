import { Pet } from "@shared/schema";

interface PetCardProps {
  pet: Pet;
  onAdoptClick: (petId: number) => void;
  onFavoriteClick: (petId: number) => void;
  isFavorited: boolean;
}

export function PetCard({ pet, onAdoptClick, onFavoriteClick, isFavorited }: PetCardProps) {
  return (
    <div className="pet-card bg-white rounded-[12px] shadow-sm mb-4 overflow-hidden">
      <img 
        src={pet.imageUrl} 
        alt={`${pet.name} - ${pet.breed}`} 
        className="w-full h-[180px] object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-['Nunito'] font-bold text-lg">{pet.name}</h3>
            <p className="text-sm text-gray-600">{pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'}</p>
          </div>
          <span className="bg-[#FFD166] text-[#343A40] text-xs font-semibold px-2 py-1 rounded-full">
            {pet.status}
          </span>
        </div>
        <p className="text-sm text-gray-700 mb-3">{pet.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img src={pet.ownerAvatarUrl} alt={`${pet.ownerName}'s avatar`} className="w-6 h-6 rounded-full" />
            <span className="text-xs ml-1 text-gray-600">{pet.ownerName}'s Pet</span>
          </div>
          <div className="flex gap-2">
            <button 
              className="bg-gray-100 text-gray-700 p-2 rounded-full"
              onClick={() => onFavoriteClick(pet.id)}
            >
              <i className={`${isFavorited ? 'ri-heart-fill text-primary' : 'ri-heart-line'} text-sm`}></i>
            </button>
            <button 
              className="bg-primary text-white px-3 py-1 rounded-full text-sm"
              onClick={() => onAdoptClick(pet.id)}
            >
              Adopt Me
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

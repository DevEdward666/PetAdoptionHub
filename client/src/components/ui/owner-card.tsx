import { Owner } from "../../types/schema";
import { Pet } from "@shared/schema";

interface OwnerCardProps {
  owner: Owner;
  pets: Pet[];
  onViewProfile: (ownerId: number) => void;
}

export function OwnerCard({ owner, pets, onViewProfile }: OwnerCardProps) {
  return (
    <div className="bg-white rounded-[12px] shadow-sm mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <img 
            src={owner.avatarUrl} 
            alt={owner.name} 
            className="w-14 h-14 rounded-full object-cover"
          />
          <div className="ml-3">
            <h3 className="font-['Nunito'] font-bold">{owner.name}</h3>
            <p className="text-sm text-gray-600">{owner.type} • {pets.length} {pets.length === 1 ? 'pet' : 'pets'}</p>
          </div>
        </div>
        <p className="text-sm text-gray-700 mb-3">{owner.bio}</p>
        
        {/* Owner's pets preview */}
        <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar pb-1">
          {pets.slice(0, 3).map(pet => (
            <img 
              key={pet.id}
              src={pet.imageUrl} 
              alt={pet.name}
              className="w-16 h-16 rounded-lg object-cover" 
            />
          ))}
          {pets.length > 3 && (
            <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-semibold">
              +{pets.length - 3}
            </div>
          )}
        </div>
        
        <button 
          className="w-full bg-[#4ECDC4] text-white py-2 rounded-full text-sm font-semibold"
          onClick={() => onViewProfile(owner.id)}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}

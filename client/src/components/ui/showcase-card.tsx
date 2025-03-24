import { Pet } from "../../types/schema";
import { Link } from "wouter";

interface ShowcaseCardProps {
  pet: Pet;
  onLike: (petId: number) => void;
}

export function ShowcaseCard({ pet, onLike }: ShowcaseCardProps) {
  return (
    <Link href={`/pet/${pet.id}`}>
    <div className="bg-white rounded-[12px] shadow-sm overflow-hidden">
      <div className="relative">
        <img 
          src={pet.imageUrl} 
          alt={pet.name} 
          className="w-full h-32 object-cover"
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
          {pet.name}
        </div>
      </div>
      <div className="p-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src={pet.ownerAvatarUrl} 
              alt={`${pet.ownerName}'s avatar`} 
              className="w-5 h-5 rounded-full"
            />
            <span className="text-xs ml-1 text-gray-600">{pet.ownerName}</span>
          </div>
          <div className="flex items-center">
            <button onClick={(e) => {
              e.stopPropagation();
              onLike(pet.id);
            }} className="flex items-center">
              <i className="ri-heart-fill text-primary text-sm"></i>
              <span className="text-xs ml-1">{pet.likes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    </Link>
  );
}

// components/GameCard.tsx
import { Star } from 'lucide-react';
import Image from 'next/image';

type GameCardProps = {
  title: string;
  imageUrl: string;
  rating: number;
  price: string;
  discount?: string;
};

const GameCard = ({ title, imageUrl, rating, price, discount }: GameCardProps) => {
  return (
    <div className="bg-[#1F222B] rounded-lg overflow-hidden group">
      <div className="relative">
        <Image src={imageUrl} alt={title} width={280} height={380} className="w-full object-cover group-hover:opacity-80 transition-opacity" />
        {discount && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            {discount}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold truncate">{title}</h3>
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-current" />
            <span className="text-sm">{rating.toFixed(1)}</span>
          </div>
          <p className="font-semibold">{price}</p>
        </div>
      </div>
    </div>
  );
};

export default GameCard;

import React from 'react';
import { Attraction } from '../types';

interface AttractionCardProps {
  attraction: Attraction;
}

const AttractionCard: React.FC<AttractionCardProps> = ({ attraction }) => {
  const { name, images, url } = attraction;

  // 如果沒有圖片，使用 Unsplash 提供的旅遊/風景主題預設圖
  const mainImage = images.length > 0 
    ? images[0].src 
    : `https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=800&q=20`; // 高品質自然風景預設圖

  return (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gray-100 transition-all duration-300 hover:shadow-2xl"
    >
      <img 
        src={mainImage} 
        alt={name}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        loading="lazy"
        onError={(e) => {
          // 如果原始圖片載入失敗，則替換為 Picsum 確保不破圖
          (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${attraction.id}/400/300`;
        }}
      />
      
      {/* 底部遮罩與標題 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-md line-clamp-1">
          {name}
        </h3>
        <div className="mt-2 h-1 w-0 bg-[#4db6ac] transition-all duration-500 group-hover:w-1/3" />
      </div>

      {/* 行政區標籤 */}
      <div className="absolute top-4 right-4 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="rounded-full bg-black/40 backdrop-blur-md px-4 py-1 text-[10px] font-bold text-white border border-white/20 uppercase tracking-tighter">
          {attraction.distric || 'TAIPEI'}
        </span>
      </div>
    </a>
  );
};

export default AttractionCard;

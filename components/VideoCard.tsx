import React, { useState, useEffect } from 'react';
import { VideoCase, ViewMode, ChannelProfile } from '../types';
import { MoreVertical } from 'lucide-react';

interface VideoCardProps {
  data: VideoCase;
  channel: ChannelProfile;
  mode: ViewMode;
  darkMode: boolean;
  variantIndex?: number; // Optional index for "Option 1", "Option 2" label
}

// A visually better SVG placeholder for absolute worst-case scenario
const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='100%25' height='100%25' fill='%231e1e1e'/%3E%3Ccircle cx='400' cy='225' r='60' fill='none' stroke='%23555' stroke-width='10'/%3E%3Cpath d='M380 180 L440 225 L380 270 Z' fill='%23555'/%3E%3Ctext x='50%25' y='80%25' text-anchor='middle' font-family='sans-serif' fill='%23555' font-size='24'%3EVIDEO PREVIEW%3C/text%3E%3C/svg%3E";

export const VideoCard: React.FC<VideoCardProps> = ({ data, channel, mode, darkMode, variantIndex }) => {
  const isDesktop = mode === ViewMode.DESKTOP;
  const [imgSrc, setImgSrc] = useState<string | null>(data.thumbnailUrl);
  const [hasError, setHasError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Sync internal image state when prop changes
  useEffect(() => {
    setImgSrc(data.thumbnailUrl);
    setHasError(false);
  }, [data.thumbnailUrl]);

  // Reset avatar error if channel url changes
  useEffect(() => {
    setAvatarError(false);
  }, [channel.avatarUrl]);

  const handleImageError = () => {
    if (imgSrc && imgSrc.includes('maxresdefault')) {
      setImgSrc(imgSrc.replace('maxresdefault', 'hqdefault'));
    } else if (imgSrc !== FALLBACK_IMAGE) {
      setImgSrc(FALLBACK_IMAGE);
    } else {
      setHasError(true);
    }
  };

  // YouTube Colors
  const textPrimary = darkMode ? 'text-white' : 'text-[#0f0f0f]';
  const textSecondary = darkMode ? 'text-[#aaaaaa]' : 'text-[#606060]';
  
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const shouldShowAvatarImage = channel.avatarUrl && !avatarError;

  return (
    <div 
      className={`flex flex-col w-full cursor-pointer group relative ${isDesktop ? 'gap-3' : 'gap-3 pb-4'}`}
    >
      
      {/* Option Label */}
      {variantIndex !== undefined && (
        <div className={`absolute -top-6 left-0 text-xs font-mono font-medium uppercase tracking-widest pl-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Option {variantIndex + 1}
        </div>
      )}

      {/* Thumbnail Container */}
      <div 
        className={`relative w-full aspect-video rounded-xl overflow-hidden flex-shrink-0 shadow-sm ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}
      >
        {!hasError && imgSrc ? (
          <img 
            src={imgSrc}
            alt={data.title}
            className="w-full h-full object-cover"
            crossOrigin="anonymous"
            onError={handleImageError}
          />
        ) : (
          <div className={`w-full h-full flex flex-col items-center justify-center ${darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'}`}>
             <div className="text-4xl mb-2">?</div>
             <span className="text-xs font-medium">No Image</span>
          </div>
        )}
        
        {/* Duration Badge */}
        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded font-medium z-10">
          {data.duration}
        </div>
      </div>

      {/* Meta Data */}
      <div className="flex gap-3 items-start pr-6 relative">
        {/* Channel Avatar */}
        <div className="flex-shrink-0 mt-0.5">
           {shouldShowAvatarImage ? (
             <img 
               src={channel.avatarUrl} 
               alt="Avatar" 
               crossOrigin="anonymous"
               onError={() => setAvatarError(true)}
               className="w-9 h-9 rounded-full object-cover"
             />
           ) : (
             <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold select-none ${darkMode ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'}`}>
                {getInitials(channel.name)}
             </div>
           )}
        </div>

        <div className="flex flex-col w-full min-w-0">
          {/* Title */}
          <h3 
            className={`${textPrimary} text-base font-semibold mb-1 group-hover:text-blue-400 transition-colors block line-clamp-2`}
            style={{ lineHeight: '1.4rem', maxHeight: '2.8rem' }}
            title={data.title}
          >
            {data.title || "Your Video Title Goes Here"}
          </h3>

          {/* Channel Name & Stats */}
          <div className={`${textSecondary} text-sm flex flex-col`}>
            <div className={`flex items-center ${!isDesktop ? 'hidden' : ''}`}>
              <span className="hover:text-white transition-colors truncate">{channel.name}</span>
            </div>
            <div className="flex items-center truncate">
              {!isDesktop && <span className="mr-1 after:content-['•'] after:mx-1 truncate">{channel.name}</span>}
              <span className="whitespace-nowrap">{data.views} views</span>
              <span className="mx-1">•</span>
              <span className="whitespace-nowrap">{data.uploadedTime}</span>
            </div>
          </div>
        </div>
        
        {/* Kebab Menu */}
        <button className={`absolute top-0 right-[-10px] p-1 opacity-0 group-hover:opacity-100 transition-opacity ${textPrimary}`}>
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
};
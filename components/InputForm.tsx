import React, { useState } from 'react';
import { VideoCase } from '../types';
import { Image as ImageIcon, Sparkles, Upload, X } from 'lucide-react';
import { generateTitleIdeas } from '../services/geminiService';

interface InputFormProps {
  videoCase: VideoCase;
  index: number;
  onChange: (index: number, field: keyof VideoCase, value: any) => void;
  isActive: boolean;
  darkMode?: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ videoCase, index, onChange, isActive, darkMode = false }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(index, 'thumbnailUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateTitles = async () => {
    if (!videoCase.title) return;
    setIsGenerating(true);
    const ideas = await generateTitleIdeas(videoCase.title);
    setIsGenerating(false);
    if (ideas.length > 0) {
      onChange(index, 'title', ideas[0]); 
    }
  };

  const borderColor = isActive 
    ? 'border-blue-500 ring-1 ring-blue-500' 
    : (darkMode ? 'border-gray-700 hover:border-gray-600' : 'border-gray-200 hover:border-gray-300');

  const containerBg = darkMode ? 'bg-[#1f1f1f]' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const mutedText = darkMode ? 'text-gray-400' : 'text-gray-500';
  const inputBg = darkMode ? 'bg-[#121212]' : 'bg-gray-50';
  const inputBorder = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`${containerBg} p-3 rounded-lg border ${borderColor} transition-all shadow-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <span className={`${mutedText} font-mono text-[10px] uppercase tracking-widest`}>Option {index + 1}</span>
        {videoCase.thumbnailUrl && (
          <button 
            onClick={() => onChange(index, 'thumbnailUrl', null)}
            className="text-red-400 hover:text-red-300 text-[10px] flex items-center gap-1"
          >
            <X size={10} /> Clear
          </button>
        )}
      </div>

      <div className="flex gap-3">
        {/* Compact Image Upload Area */}
        <div className="w-36 flex-shrink-0">
          <label className="block relative group cursor-pointer">
            <div className={`w-full aspect-video rounded overflow-hidden border-2 border-dashed ${videoCase.thumbnailUrl ? 'border-transparent' : (darkMode ? 'border-gray-600 bg-[#2a2a2a]' : 'border-gray-300 bg-gray-100')} flex flex-col items-center justify-center transition-colors hover:border-blue-400`}>
              {videoCase.thumbnailUrl ? (
                <>
                  <img src={videoCase.thumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="text-white" size={16} />
                  </div>
                </>
              ) : (
                <ImageIcon className={darkMode ? "text-gray-600" : "text-gray-400"} size={20} />
              )}
            </div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </label>
        </div>

        {/* Compact Title Input */}
        <div className="flex-1 flex flex-col gap-2">
          <textarea
            value={videoCase.title}
            onChange={(e) => onChange(index, 'title', e.target.value)}
            placeholder="Video title..."
            className={`w-full flex-1 text-sm p-2 rounded border ${inputBg} ${inputBorder} ${textColor} focus:border-blue-500 focus:outline-none resize-none leading-tight`}
            maxLength={100}
            rows={3}
          />
          
          <div className="flex justify-between items-center">
             <span className={`text-[10px] ${videoCase.title.length > 60 ? 'text-orange-500' : mutedText}`}>
              {videoCase.title.length}/100
            </span>
            <button
              onClick={handleGenerateTitles}
              disabled={isGenerating || !videoCase.title}
              className={`text-[10px] flex items-center gap-1 px-2 py-1 rounded transition-colors ${isGenerating || !videoCase.title ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500 hover:bg-blue-500/10'}`}
            >
              <Sparkles size={10} />
              {isGenerating ? 'Thinking...' : 'AI Reword'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
import React, { useState, useEffect, useRef } from 'react';
import { VideoCase, ChannelProfile, ViewMode } from './types';
import { VideoCard } from './components/VideoCard';
import { InputForm } from './components/InputForm';
import { LayoutGrid, Smartphone, Moon, Sun, Play, Download, Upload, Shuffle } from 'lucide-react';
import { toPng } from 'html-to-image';
import { TRENDING_VIDEOS, MOCK_CHANNELS } from './trendingData';

const INITIAL_CASES: VideoCase[] = [
  { id: 1, thumbnailUrl: null, title: "I Built a React App in 5 Minutes", channelName: "Tech Ninja", views: "245K", uploadedTime: "2 days ago", duration: "12:45" },
  { id: 2, thumbnailUrl: null, title: "", channelName: "Tech Ninja", views: "10K", uploadedTime: "1 hour ago", duration: "08:30" },
  { id: 3, thumbnailUrl: null, title: "", channelName: "Tech Ninja", views: "5K", uploadedTime: "3 hours ago", duration: "15:00" },
  { id: 4, thumbnailUrl: null, title: "", channelName: "Tech Ninja", views: "0", uploadedTime: "Just now", duration: "10:00" },
  { id: 5, thumbnailUrl: null, title: "", channelName: "Tech Ninja", views: "0", uploadedTime: "Just now", duration: "14:20" },
  { id: 6, thumbnailUrl: null, title: "", channelName: "Tech Ninja", views: "0", uploadedTime: "Just now", duration: "11:15" },
];

const INITIAL_CHANNEL: ChannelProfile = {
  name: "Tech Creator",
  avatarUrl: "" // Fallback handled in VideoCard
};

interface FeedItem {
  type: 'user' | 'trending';
  data: VideoCase & { originalIndex?: number };
  variantIndex?: number; // Dynamically assigned for display
}

const App: React.FC = () => {
  const [cases, setCases] = useState<VideoCase[]>(INITIAL_CASES);
  const [channel, setChannel] = useState<ChannelProfile>(INITIAL_CHANNEL);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DESKTOP);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Shuffle state
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  
  const previewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Filter cases for preview
  const activeCases = cases.map((c, i) => ({...c, originalIndex: i}))
                           .filter(c => c.thumbnailUrl || c.title.trim().length > 0);

  useEffect(() => {
    // Check for shared state in URL
    const searchParams = new URLSearchParams(window.location.search);
    const sharedState = searchParams.get('s');
    if (sharedState) {
      try {
        const decoded = JSON.parse(atob(sharedState));
        if (decoded.cases && Array.isArray(decoded.cases)) {
          const mergedCases = INITIAL_CASES.map((defaultCase, i) => {
            const sharedCase = decoded.cases[i];
            return sharedCase ? { ...defaultCase, ...sharedCase, thumbnailUrl: null } : defaultCase;
          });
          setCases(mergedCases);
        }
        if (decoded.channel) {
            setChannel(prev => ({...prev, ...decoded.channel, avatarUrl: ''})); 
        }
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {
        console.error("Failed to restore shared state", e);
      }
    }
    setMounted(true);
  }, []);

  const handleCaseChange = (index: number, field: keyof VideoCase, value: any) => {
    const newCases = [...cases];
    newCases[index] = { ...newCases[index], [field]: value };
    setCases(newCases);
  };

  const updateChannel = (field: keyof ChannelProfile, value: string) => {
    setChannel(prev => ({ ...prev, [field]: value }));
  };

  const handleDownload = async () => {
    if (!exportRef.current) return;
    
    setIsDownloading(true);

    // Give the browser a moment to paint the hidden container if it hasn't already
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const dataUrl = await toPng(exportRef.current, {
        quality: 1.0,
        pixelRatio: 2, // High resolution
        cacheBust: true,
        skipAutoScale: true,
        filter: (node) => {
             // Explicitly ignore any link tags to avoid remote stylesheet errors
             if (node.tagName === 'LINK') return false;
             return true;
        }
      });

      const link = document.createElement('a');
      link.download = `tube-preview.png`;
      link.href = dataUrl;
      link.click();

    } catch (error) {
      console.error("Screenshot failed:", error);
      alert("Failed to generate image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!mounted) return null;

  // --- FEED LOGIC ---
  const TOTAL_ITEMS = 9;
  const neededTrendingCount = Math.max(0, TOTAL_ITEMS - activeCases.length);
  const trendingToDisplay = TRENDING_VIDEOS.slice(0, neededTrendingCount);
     
  const rawFeedItems: FeedItem[] = [
      ...activeCases.map(c => ({ type: 'user' as const, data: c })),
      ...trendingToDisplay.map(c => ({ type: 'trending' as const, data: c }))
  ];

  // Handle Shuffling
  const toggleShuffle = () => {
    if (!isShuffled) {
      // Generate new shuffle order
      const indices = Array.from({ length: rawFeedItems.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledIndices(indices);
      setIsShuffled(true);
    } else {
      setIsShuffled(false);
    }
  };

  // Apply shuffle if active
  let orderedFeedItems = rawFeedItems;
  if (isShuffled && shuffledIndices.length === rawFeedItems.length) {
    orderedFeedItems = shuffledIndices.map(i => rawFeedItems[i]);
  } else if (isShuffled && shuffledIndices.length !== rawFeedItems.length) {
    // If length mismatch (e.g. added new case), reset or regenerate
    // For simplicity, let's regenerate immediately
    const indices = Array.from({ length: rawFeedItems.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    setShuffledIndices(indices);
    orderedFeedItems = indices.map(i => rawFeedItems[i]);
  }

  let userOptionCounter = 0;
  const finalFeedItems = orderedFeedItems.map(item => {
    if (item.type === 'user') {
      return { ...item, variantIndex: userOptionCounter++ };
    }
    return item;
  });

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'} relative`}>
      
      {/* 
         HIDDEN EXPORT CONTAINER 
         Positioned with negative z-index so it sits BEHIND the main app content,
         but is technically "visible" in the viewport so the browser paints it.
         We force desktop width (1280px) and desktop grid layout here.
      */}
      <div 
        ref={exportRef}
        id="export-container"
        className={`fixed top-0 left-0 w-[1280px] p-12 -z-50 ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-white'}`}
      >
         <div className="flex items-center gap-2 mb-8 opacity-50">
            <div className={`h-3 w-3 rounded-full ${isDarkMode ? 'bg-red-500' : 'bg-red-400'}`}></div>
            <div className={`h-3 w-3 rounded-full ${isDarkMode ? 'bg-yellow-500' : 'bg-yellow-400'}`}></div>
            <div className={`h-3 w-3 rounded-full ${isDarkMode ? 'bg-green-500' : 'bg-green-400'}`}></div>
            <span className="ml-2 text-sm font-mono">YouTube Desktop Home Preview</span>
        </div>
        <div className="grid grid-cols-3 gap-x-6 gap-y-8">
            {finalFeedItems.map((item, idx) => (
                <VideoCard 
                    key={`export-${item.type}-${item.data.id}-${idx}`}
                    data={item.data}
                    channel={item.type === 'user' ? channel : MOCK_CHANNELS[item.data.channelName] || { name: item.data.channelName, avatarUrl: '' }}
                    mode={ViewMode.DESKTOP}
                    darkMode={isDarkMode}
                    variantIndex={item.variantIndex}
                />
            ))}
        </div>
      </div>

      {/* MAIN APP CONTENT - Wrapped in relative/z-index to cover the hidden export container */}
      <div className="relative z-10 flex flex-col min-h-screen bg-inherit">
        
        {/* Header */}
        <header className={`border-b ${isDarkMode ? 'border-gray-800 bg-[#0f0f0f]' : 'border-gray-200 bg-white'} p-4 sticky top-0 z-50`}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-red-600 text-white p-1 rounded-lg">
                <Play fill="white" size={20} />
              </div>
              <h1 className="text-xl font-bold tracking-tight">TubePreview</h1>
              <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-500 rounded-full font-medium">Beta</span>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4">
              <div className={`flex p-1 rounded-lg ${isDarkMode ? 'bg-[#272727]' : 'bg-gray-200'}`}>
                <button
                  onClick={() => setViewMode(ViewMode.DESKTOP)}
                  className={`p-2 rounded-md flex items-center gap-2 text-sm transition-all ${viewMode === ViewMode.DESKTOP ? (isDarkMode ? 'bg-[#3f3f3f] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500 hover:text-gray-400'}`}
                >
                  <LayoutGrid size={18} /> Desktop
                </button>
                <button
                  onClick={() => setViewMode(ViewMode.MOBILE)}
                  className={`p-2 rounded-md flex items-center gap-2 text-sm transition-all ${viewMode === ViewMode.MOBILE ? (isDarkMode ? 'bg-[#3f3f3f] text-white shadow' : 'bg-white text-black shadow') : 'text-gray-500 hover:text-gray-400'}`}
                >
                  <Smartphone size={18} /> Mobile
                </button>
              </div>
              
              <div className="h-6 w-px bg-gray-700 mx-2 hidden md:block"></div>

              <div className="flex gap-2">
                  <button
                    onClick={toggleShuffle}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all border ${isShuffled 
                      ? (isDarkMode ? 'bg-blue-600/20 text-blue-400 border-blue-600/50' : 'bg-blue-50 text-blue-600 border-blue-200') 
                      : (isDarkMode ? 'border-gray-600 hover:bg-gray-800 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-600')}`}
                  >
                    <Shuffle size={16} />
                    Mix Feed
                  </button>

                  <button 
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${isDarkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}
                  >
                      {isDownloading ? (
                          <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                          <Download size={16} />
                      )}
                      Save Image
                  </button>
              </div>

              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full hover:bg-opacity-1 hover:bg-gray-500 transition-colors`}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8 flex flex-col xl:flex-row gap-8 relative">
          
          {/* LEFT SIDE: Controls */}
          <div className="w-full xl:w-[400px] flex flex-col gap-6 flex-shrink-0 xl:h-[calc(100vh-100px)] xl:overflow-y-auto custom-scrollbar">
            
            <div className={`p-5 rounded-xl border ${isDarkMode ? 'bg-[#1f1f1f] border-gray-800' : 'bg-white border-gray-200'}`}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                Channel Settings
              </h2>
              <div className="flex gap-4 items-center">
                 <div className="relative w-12 h-12 flex-shrink-0 group cursor-pointer">
                    {channel.avatarUrl ? (
                      <img 
                          src={channel.avatarUrl} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-700 group-hover:border-blue-500 transition-colors"
                          alt="Channel"
                          crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-lg border-2 border-gray-700 group-hover:border-blue-500 transition-colors">
                          {channel.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={16} className="text-white" />
                    </div>
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                          const file = e.target.files?.[0];
                          if(file) {
                              const reader = new FileReader();
                              reader.onloadend = () => updateChannel('avatarUrl', reader.result as string);
                              reader.readAsDataURL(file);
                          }
                      }}
                    />
                 </div>
                 <div className="flex-1">
                    <label className="text-xs text-gray-500 mb-1 block">Channel Name</label>
                    <input 
                      type="text" 
                      value={channel.name}
                      onChange={(e) => updateChannel('name', e.target.value)}
                      className={`w-full text-sm p-2 rounded border bg-transparent focus:outline-none focus:border-blue-500 ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}
                    />
                 </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Thumbnails & Titles</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 gap-3 pb-8">
              {cases.map((item, index) => (
                <InputForm 
                  key={item.id} 
                  index={index} 
                  videoCase={item} 
                  onChange={handleCaseChange}
                  isActive={item.thumbnailUrl !== null || item.title.length > 0}
                  darkMode={isDarkMode}
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Preview */}
          <div className="flex-1 flex justify-center bg-opacity-50 min-h-[600px]">
              <div 
                  className={`w-full transition-all duration-500 ease-in-out flex flex-col items-center`}
              >
                  <div 
                      ref={previewRef}
                      id="preview-container"
                      className={`p-8 pb-12 rounded-2xl transition-all duration-300 w-full ${viewMode === ViewMode.MOBILE ? 'max-w-[400px]' : 'max-w-full'} ${isDarkMode ? 'bg-[#0f0f0f]' : 'bg-white'}`}
                  >
                      <div className="flex items-center gap-2 mb-6 opacity-50">
                          <div className={`h-3 w-3 rounded-full ${isDarkMode ? 'bg-red-500' : 'bg-red-400'}`}></div>
                          <div className={`h-3 w-3 rounded-full ${isDarkMode ? 'bg-yellow-500' : 'bg-yellow-400'}`}></div>
                          <div className={`h-3 w-3 rounded-full ${isDarkMode ? 'bg-green-500' : 'bg-green-400'}`}></div>
                          <span className="ml-2 text-sm font-mono">YouTube {viewMode === ViewMode.DESKTOP ? 'Desktop' : 'Mobile App'} Home</span>
                      </div>

                      <div className={`grid gap-y-8 gap-x-4 w-full ${
                          viewMode === ViewMode.DESKTOP 
                          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3' 
                          : 'grid-cols-1'
                      }`}>
                          {finalFeedItems.map((item, idx) => (
                              <VideoCard 
                                  key={`${item.type}-${item.data.id}-${idx}`}
                                  data={item.data}
                                  channel={item.type === 'user' ? channel : MOCK_CHANNELS[item.data.channelName] || { name: item.data.channelName, avatarUrl: '' }}
                                  mode={viewMode}
                                  darkMode={isDarkMode}
                                  variantIndex={item.variantIndex}
                              />
                          ))}
                      </div>
                  </div>
                  
                  <div className="mt-4 text-center opacity-50 text-sm">
                      Fill in a title or upload an image to see it appear in the preview.
                  </div>
              </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;
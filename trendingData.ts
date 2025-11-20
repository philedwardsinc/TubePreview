import { VideoCase, ChannelProfile } from './types';

export const TRENDING_VIDEOS: VideoCase[] = [
  // 1. MrBeast - Squid Game
  { 
    id: 101, 
    thumbnailUrl: "https://i.ytimg.com/vi/0e3GPea1Tyg/hqdefault.jpg", 
    title: "$456,000 Squid Game In Real Life!", 
    channelName: "MrBeast", 
    views: "560M", 
    uploadedTime: "2 years ago", 
    duration: "25:42" 
  },
  // 2. Mark Rober - Squirrel Maze
  { 
    id: 102, 
    thumbnailUrl: "https://i.ytimg.com/vi/hFZFjoX2cGg/hqdefault.jpg", 
    title: "Backyard Squirrel Maze 1.0- Ninja Warrior Course", 
    channelName: "Mark Rober", 
    views: "115M", 
    uploadedTime: "3 years ago", 
    duration: "21:43" 
  },
  // 3. Kurzgesagt - The Egg
  { 
    id: 104, 
    thumbnailUrl: "https://i.ytimg.com/vi/h6fcK_fRYaI/hqdefault.jpg", 
    title: "The Egg - A Short Story", 
    channelName: "Kurzgesagt", 
    views: "31M", 
    uploadedTime: "4 years ago", 
    duration: "07:55" 
  },
  // 4. MKBHD - Apple Vision Pro
  { 
    id: 106, 
    thumbnailUrl: "https://i.ytimg.com/vi/dtp6b76pMak/hqdefault.jpg", 
    title: "Using Apple Vision Pro: What It's Actually Like!", 
    channelName: "MKBHD", 
    views: "25M", 
    uploadedTime: "1 month ago", 
    duration: "15:20" 
  },
  // 5. Vsauce - Banach-Tarski
  { 
    id: 107, 
    thumbnailUrl: "https://i.ytimg.com/vi/s86-Z-CbaHA/hqdefault.jpg", 
    title: "The Banach-Tarski Paradox", 
    channelName: "Vsauce", 
    views: "41M", 
    uploadedTime: "8 years ago", 
    duration: "25:30" 
  },
  // 6. BBC Earth - Iguana vs Snakes
  { 
    id: 108, 
    thumbnailUrl: "https://i.ytimg.com/vi/Rv9hn4IGofM/hqdefault.jpg", 
    title: "Iguana vs Snakes - Planet Earth II", 
    channelName: "BBC Earth", 
    views: "120M", 
    uploadedTime: "7 years ago", 
    duration: "05:24" 
  },
  // 7. SmarterEveryDay - Prince Rupert's Drop
  { 
    id: 111, 
    thumbnailUrl: "https://i.ytimg.com/vi/xe-f4gokRBs/hqdefault.jpg", 
    title: "Mystery of Prince Rupert's Drop at 100,000 FPS", 
    channelName: "SmarterEveryDay", 
    views: "45M", 
    uploadedTime: "6 years ago", 
    duration: "11:22" 
  },
  // 8. TED - Procrastination
  { 
    id: 113, 
    thumbnailUrl: "https://i.ytimg.com/vi/arj7oStGLkU/hqdefault.jpg", 
    title: "Inside the mind of a master procrastinator | Tim Urban", 
    channelName: "TED", 
    views: "65M", 
    uploadedTime: "7 years ago", 
    duration: "14:03" 
  },
  // 9. Casey Neistat - First Class
  { 
    id: 114, 
    thumbnailUrl: "https://i.ytimg.com/vi/84WIaK3bl_s/hqdefault.jpg", 
    title: "THE $21,000 FIRST CLASS AIRPLANE SEAT", 
    channelName: "CaseyNeistat", 
    views: "81M", 
    uploadedTime: "4 years ago", 
    duration: "08:47" 
  }
];

export const MOCK_CHANNELS: Record<string, ChannelProfile> = {
  "MrBeast": { name: "MrBeast", avatarUrl: "" },
  "Mark Rober": { name: "Mark Rober", avatarUrl: "" },
  "Kurzgesagt": { name: "Kurzgesagt – In a Nutshell", avatarUrl: "" },
  "MKBHD": { name: "Marques Brownlee", avatarUrl: "" },
  "Vsauce": { name: "Vsauce", avatarUrl: "" },
  "BBC Earth": { name: "BBC Earth", avatarUrl: "" },
  "SmarterEveryDay": { name: "SmarterEveryDay", avatarUrl: "" },
  "TED": { name: "TED", avatarUrl: "" },
  "CaseyNeistat": { name: "CaseyNeistat", avatarUrl: "" }
};
export interface VideoCase {
  id: number;
  thumbnailUrl: string | null;
  title: string;
  channelName: string;
  views: string;
  uploadedTime: string;
  duration: string;
}

export interface ChannelProfile {
  name: string;
  avatarUrl: string;
}

export enum ViewMode {
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE'
}

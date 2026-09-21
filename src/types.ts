export type UserRole = 'client' | 'provider';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  avatar: string;
  facialVerified: boolean;
  facialVerificationDate?: string;
  facialPhotoUrl?: string;
  documentVerified?: boolean;
  documentType?: 'RG' | 'CNH';
  documentPhotoUrl?: string;
  // Provider specific properties
  slug?: string;
  category?: string;
  specialtyTags?: string[];
  bio?: string;
  city?: string;
  neighborhood?: string;
  rating?: number;
  totalReviews?: number;
  completedJobsCount?: number;
  portfolioPhotos?: string[];
  basePriceNotice?: string;
  availableToday?: boolean;
  coordinates?: { lat: number; lng: number };
}

export interface AiRequestAnalysis {
  category: string;
  serviceType: string;
  urgency: 'Baixa' | 'Média' | 'Alta';
  estimatedDuration: string;
  requiredTools: string[];
  technicalSummary: string;
  priceRangeEstimate: string;
}

export interface ProviderQuote {
  id: string;
  requestId: string;
  providerId: string;
  providerName: string;
  providerAvatar: string;
  providerPhone: string;
  providerRating: number;
  providerJobsCount: number;
  providerFacialVerified: boolean;
  providerDocVerified: boolean;
  price: number;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: string;
  message: string;
  warrantyTerms: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

export type ServiceStatus =
  | 'open'
  | 'quotes_received'
  | 'accepted'
  | 'provider_en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface ServiceRequest {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  clientCoordinates: { lat: number; lng: number };
  title: string;
  description: string;
  category: string;
  mediaType?: 'photo' | 'video' | 'audio' | 'none';
  mediaUrl?: string;
  audioBlobUrl?: string;
  aiAnalysis?: AiRequestAnalysis;
  status: ServiceStatus;
  createdAt: string;
  quotes: ProviderQuote[];
  selectedQuoteId?: string;
  directProviderId?: string; // Direct quote requested via micro-page
}

export interface ChatMessage {
  id: string;
  requestId: string;
  senderId: string;
  senderName: string;
  senderRole: 'client' | 'provider';
  text: string;
  timestamp: string;
  isLocationShare?: boolean;
  locationData?: { lat: number; lng: number; label: string };
  isSystemUpdate?: boolean;
}

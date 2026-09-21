import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Zap,
  Scissors,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Star,
  ExternalLink,
  Plus,
  MessageSquare,
  Users,
  Search,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  UserProfile,
  ServiceRequest,
  ProviderQuote,
  ChatMessage,
  ServiceStatus
} from './types';
import {
  INITIAL_CLIENT,
  INITIAL_PROVIDERS,
  INITIAL_REQUESTS,
  INITIAL_MESSAGES
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { UberMapView } from './components/UberMapView';
import { UberBottomSheet } from './components/UberBottomSheet';
import { UberDriverOverlay } from './components/UberDriverOverlay';
import { FacialVerificationModal } from './components/FacialVerificationModal';
import { DocumentVerificationModal } from './components/DocumentVerificationModal';
import { ChatAndTrackingModal } from './components/ChatAndTrackingModal';
import { ProviderMicroPage } from './components/ProviderMicroPage';
import { RegisterModal } from './components/RegisterModal';
import { NewRequestModal } from './components/NewRequestModal';
import { VercelDeployModal } from './components/VercelDeployModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_CLIENT);
  const [providers, setProviders] = useState<UserProfile[]>(INITIAL_PROVIDERS);
  const [requests, setRequests] = useState<ServiceRequest[]>(INITIAL_REQUESTS);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Eletricista');

  // Uber flow state: 'idle' -> 'radar' -> 'quotes' -> 'en_route' -> 'in_progress' -> 'completed'
  const [serviceStep, setServiceStep] = useState<
    'idle' | 'radar' | 'quotes' | 'en_route' | 'in_progress' | 'completed'
  >('quotes'); // Starts in quotes for immediate demonstration of comparative Uber deck!

  const [activeRequestId, setActiveRequestId] = useState<string>(INITIAL_REQUESTS[0].id);
  const [selectedProvider, setSelectedProvider] = useState<UserProfile | null>(INITIAL_PROVIDERS[0]);

  // Live GPS Tracking Metrics
  const [providerDistanceKm, setProviderDistanceKm] = useState<number>(1.4);
  const [providerEtaMinutes, setProviderEtaMinutes] = useState<number>(4);

  // Modals & Navigation
  const [isFacialModalOpen, setIsFacialModalOpen] = useState(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isVercelModalOpen, setIsVercelModalOpen] = useState(false);
  const [selectedMicroPage, setSelectedMicroPage] = useState<UserProfile | null>(null);

  // Check URL hash for direct public micro-page navigation (e.g. #p/carlos-mendes-eletricista)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#p/')) {
        const slug = hash.replace('#p/', '');
        const found = providers.find((p) => p.slug === slug);
        if (found) setSelectedMicroPage(found);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [providers]);

  const activeRequest = requests.find((r) => r.id === activeRequestId) || requests[0];

  // Handler: Start Uber-like search
  const handleRequestQuotes = (
    title: string,
    desc: string,
    audioUrl?: string,
    photoUrl?: string
  ) => {
    const newReqId = `req-${Date.now()}`;
    const newReq: ServiceRequest = {
      id: newReqId,
      clientId: currentUser.id,
      clientName: currentUser.name,
      clientPhone: currentUser.phone,
      clientAddress: 'Rua Fradique Coutinho, 1240 - Pinheiros, São Paulo - SP',
      clientCoordinates: {
        lat: -23.5617,
        lng: -46.6865
      },
      title,
      description: desc,
      category: selectedCategory,
      mediaType: photoUrl ? 'photo' : audioUrl ? 'audio' : 'none',
      mediaUrl: photoUrl,
      audioBlobUrl: audioUrl,
      status: 'open',
      quotes: [],
      createdAt: new Date().toISOString()
    };

    setRequests((prev) => [newReq, ...prev]);
    setActiveRequestId(newReqId);
    setServiceStep('radar');

    // Simulate Radar searching and receiving responses from Providers B, C, D in 2.2 seconds
    setTimeout(() => {
      const matchingProviders = providers.filter(
        (p) => !selectedCategory || p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );

      const generatedQuotes: ProviderQuote[] = matchingProviders.slice(0, 3).map((prov, index) => ({
        id: `quote-${prov.id}-${Date.now()}`,
        requestId: newReqId,
        providerId: prov.id,
        providerName: prov.name,
        providerAvatar: prov.avatar,
        providerPhone: prov.phone,
        providerRating: prov.rating || 4.9,
        providerJobsCount: prov.completedJobsCount || 90,
        providerFacialVerified: !!prov.facialVerified,
        providerDocVerified: !!prov.documentVerified,
        price: 85 + index * 25,
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: `Em ${15 + index * 10} min`,
        estimatedDuration: '1h',
        message: 'Estou com van equipada e ferramentas completas para executar agora com garantia.',
        warrantyTerms: 'Garantia de 90 dias',
        status: 'pending',
        createdAt: new Date().toISOString()
      }));

      setRequests((prev) =>
        prev.map((r) =>
          r.id === newReqId
            ? { ...r, status: 'quotes_received', quotes: generatedQuotes }
            : r
        )
      );
      setServiceStep('quotes');
    }, 2200);
  };

  // Handler: Accept Quote (Uber rides style)
  const handleAcceptQuote = (quote: ProviderQuote) => {
    const prov = providers.find((p) => p.id === quote.providerId) || null;
    setSelectedProvider(prov);

    setRequests((prev) =>
      prev.map((r) =>
        r.id === activeRequestId
          ? { ...r, status: 'accepted', selectedQuoteId: quote.id }
          : r
      )
    );

    // Initial system confirmation message in chat
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      requestId: activeRequestId,
      senderId: 'system',
      senderName: 'Sistema ProServiços (Uber)',
      senderRole: 'client',
      text: `Corrida de serviço confirmada! ${quote.providerName} está a caminho. Valor: R$ ${quote.price.toFixed(2)}. PIN de segurança: 7412.`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isSystemUpdate: true
    };

    setMessages((prev) => ({
      ...prev,
      [activeRequestId]: [...(prev[activeRequestId] || []), newMsg]
    }));

    setServiceStep('en_route');
    setProviderDistanceKm(1.4);
    setProviderEtaMinutes(4);
  };

  // Handler: Simulate Provider Driving Closer via GPS
  const handleSimulateArrival = () => {
    let currentKm = providerDistanceKm;
    let currentEta = providerEtaMinutes;

    const interval = setInterval(() => {
      currentKm = Math.max(0, Number((currentKm - 0.4).toFixed(1)));
      currentEta = Math.max(0, currentEta - 1);
      setProviderDistanceKm(currentKm);
      setProviderEtaMinutes(currentEta);

      if (currentKm <= 0) {
        clearInterval(interval);
        setServiceStep('in_progress');
        setRequests((prev) =>
          prev.map((r) => (r.id === activeRequestId ? { ...r, status: 'in_progress' } : r))
        );

        // Notify chat
        const arrivalMsg: ChatMessage = {
          id: `msg-${Date.now()}`,
          requestId: activeRequestId,
          senderId: 'system',
          senderName: 'Sistema',
          senderRole: 'client',
          text: `🚗 O prestador ${selectedProvider?.name || 'Profissional'} chegou ao local! Confirme o PIN 7412.`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          isSystemUpdate: true
        };
        setMessages((prev) => ({
          ...prev,
          [activeRequestId]: [...(prev[activeRequestId] || []), arrivalMsg]
        }));
      }
    }, 1200);
  };

  // Handler: Complete Service
  const handleFinishService = () => {
    setServiceStep('completed');
    setRequests((prev) =>
      prev.map((r) => (r.id === activeRequestId ? { ...r, status: 'completed' } : r))
    );
  };

  // Handler: Reset to make a new service request
  const handleResetToNewService = () => {
    setServiceStep('idle');
    setProviderDistanceKm(1.8);
    setProviderEtaMinutes(5);
  };

  // Handler: Provider sends bid from Driver Cockpit
  const handleProviderSubmitQuote = (
    reqId: string,
    quoteData: Omit<ProviderQuote, 'id' | 'createdAt' | 'status'>
  ) => {
    const newQuote: ProviderQuote = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? {
              ...r,
              status: 'quotes_received',
              quotes: [...r.quotes.filter((q) => q.providerId !== quoteData.providerId), newQuote]
            }
          : r
      )
    );
  };

  // Chat message sending
  const handleSendMessage = (requestId: string, text: string, isLocation: boolean = false) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      requestId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isLocationShare: isLocation
    };

    setMessages((prev) => ({
      ...prev,
      [requestId]: [...(prev[requestId] || []), newMsg]
    }));
  };

  // Open public micro-page
  const handleOpenMicroPage = (provider: UserProfile) => {
    window.location.hash = `p/${provider.slug || 'perfil'}`;
    setSelectedMicroPage(provider);
  };

  // If viewing a standalone public micro-page via URL hash
  if (selectedMicroPage) {
    return (
      <ProviderMicroPage
        provider={selectedMicroPage}
        onRequestQuoteDirectly={(prov) => {
          setSelectedMicroPage(null);
          window.location.hash = '';
          setSelectedCategory(prov.category || 'Eletricista');
          setServiceStep('idle');
        }}
        onBack={() => {
          setSelectedMicroPage(null);
          window.location.hash = '';
        }}
      />
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-slate-950 font-sans">
      {/* Top Navbar Header */}
      <Navbar
        currentUser={currentUser}
        providers={providers}
        onSelectUser={(u) => {
          setCurrentUser(u);
          if (u.role === 'provider') {
            setSelectedProvider(u);
          }
        }}
        onOpenNewRequest={() => {
          setServiceStep('idle');
        }}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
        onOpenFacialVerification={() => setIsFacialModalOpen(true)}
        onOpenDocVerification={() => setIsDocModalOpen(true)}
        onOpenMicroPage={handleOpenMicroPage}
        onOpenVercelModal={() => setIsVercelModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Screen: Uber Map is the Primary Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <UberMapView
          userLocation={{
            lat: -23.5617,
            lng: -46.6865,
            address: 'Rua Fradique Coutinho, 1240 - Pinheiros, SP'
          }}
          providers={providers}
          selectedCategory={selectedCategory}
          activeRequest={activeRequest}
          selectedProvider={selectedProvider}
          onSelectProviderPin={(p) => {
            setSelectedProvider(p);
            handleOpenMicroPage(p);
          }}
          isRadarActive={serviceStep === 'radar'}
          providerDistanceKm={providerDistanceKm}
          providerEtaMinutes={providerEtaMinutes}
          serviceStep={serviceStep}
        />

        {/* If Current User is Client: Show Uber Bottom Sheet */}
        {currentUser.role === 'client' ? (
          <UberBottomSheet
            serviceStep={serviceStep}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onRequestQuotes={handleRequestQuotes}
            activeRequest={activeRequest}
            onAcceptQuote={handleAcceptQuote}
            selectedProvider={selectedProvider}
            onOpenMicroPage={handleOpenMicroPage}
            onOpenChat={() => setIsChatOpen(true)}
            providerDistanceKm={providerDistanceKm}
            providerEtaMinutes={providerEtaMinutes}
            onSimulateArrival={handleSimulateArrival}
            onFinishService={handleFinishService}
            onResetToNewService={handleResetToNewService}
          />
        ) : (
          /* If Current User is Provider: Show Uber Driver Cockpit HUD */
          <UberDriverOverlay
            provider={currentUser}
            incomingRequests={requests}
            onSubmitQuote={handleProviderSubmitQuote}
            onOpenMicroPage={handleOpenMicroPage}
            onOpenChat={(req) => {
              setActiveRequestId(req.id);
              setIsChatOpen(true);
            }}
            onOpenFacialVerification={() => setIsFacialModalOpen(true)}
            onOpenDocVerification={() => setIsDocModalOpen(true)}
          />
        )}
      </div>

      {/* Live Chat & Geolocation Tracking Modal */}
      {isChatOpen && activeRequest && (
        <ChatAndTrackingModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          request={activeRequest}
          currentUser={currentUser}
          provider={selectedProvider || providers[0]}
          messages={messages[activeRequest.id] || []}
          onSendMessage={handleSendMessage}
          onUpdateStatus={(reqId, newStatus) => {
            setRequests((prev) =>
              prev.map((r) => (r.id === reqId ? { ...r, status: newStatus } : r))
            );
            if (newStatus === 'completed') setServiceStep('completed');
            if (newStatus === 'in_progress') setServiceStep('in_progress');
          }}
        />
      )}

      {/* Biometric Facial Verification Modal */}
      <FacialVerificationModal
        isOpen={isFacialModalOpen}
        onClose={() => setIsFacialModalOpen(false)}
        onSuccess={(photoUrl) => {
          setCurrentUser((prev) => ({
            ...prev,
            facialVerified: true,
            facialPhotoUrl: photoUrl,
            facialVerificationDate: new Date().toISOString().split('T')[0]
          }));
        }}
        userName={currentUser.name}
        role={currentUser.role}
      />

      {/* Document (RG/CNH) Verification Modal */}
      <DocumentVerificationModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        onSuccess={(docType, docPhotoUrl) => {
          setCurrentUser((prev) => ({
            ...prev,
            documentVerified: true,
            documentType: docType,
            documentPhotoUrl: docPhotoUrl
          }));
        }}
        providerName={currentUser.name}
      />

      {/* Register New Profile Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegister={(newUser) => {
          if (newUser.role === 'provider') {
            setProviders((prev) => [newUser, ...prev]);
          }
          setCurrentUser(newUser);
        }}
        onTriggerFacial={() => setIsFacialModalOpen(true)}
        onTriggerDoc={() => setIsDocModalOpen(true)}
      />

      {/* Vercel & Database Status Modal */}
      <VercelDeployModal
        isOpen={isVercelModalOpen}
        onClose={() => setIsVercelModalOpen(false)}
      />
    </div>
  );
}

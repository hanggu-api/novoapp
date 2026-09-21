import { UserProfile, ServiceRequest, ChatMessage } from '../types';

export const INITIAL_CLIENT: UserProfile = {
  id: 'client-1',
  name: 'Ana Clara Souza',
  phone: '(11) 98765-4321',
  email: 'ana.souza@exemplo.com',
  role: 'client',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  facialVerified: true,
  facialVerificationDate: '2026-03-10',
  facialPhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
};

export const INITIAL_PROVIDERS: UserProfile[] = [
  {
    id: 'prov-b',
    name: 'Carlos Mendes',
    slug: 'carlos-mendes-eletricista',
    phone: '(11) 99123-8844',
    email: 'carlos.eletrica@exemplo.com',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
    facialVerified: true,
    facialVerificationDate: '2026-01-15',
    facialPhotoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=300&auto=format&fit=crop&q=80',
    documentVerified: true,
    documentType: 'CNH',
    documentPhotoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    category: 'Eletricista',
    specialtyTags: ['Troca de lâmpadas', 'Instalação de tomadas', 'Quadro de disjuntores', 'Chuveiro elétrico', 'Lustres & LED'],
    bio: 'Eletricista residencial e predial com mais de 12 anos de experiência. Pontualidade britânica, ferramentas profissionais e garantia formal de 90 dias em todos os serviços.',
    city: 'São Paulo',
    neighborhood: 'Pinheiros / Zona Oeste',
    rating: 4.9,
    totalReviews: 87,
    completedJobsCount: 142,
    basePriceNotice: 'A partir de R$ 90,00',
    availableToday: true,
    coordinates: { lat: -23.5617, lng: -46.6865 },
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prov-c',
    name: 'Luciana Martins',
    slug: 'luciana-eletrica-reparos',
    phone: '(11) 98234-7711',
    email: 'luciana.reparos@exemplo.com',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    facialVerified: true,
    facialVerificationDate: '2026-02-01',
    facialPhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    documentVerified: true,
    documentType: 'RG',
    documentPhotoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=80',
    category: 'Eletricista',
    specialtyTags: ['Troca de lâmpadas', 'Iluminação técnica', 'Ventilador de teto', 'Automação residencial'],
    bio: 'Engenheira e técnica eletricista. Especialista em iluminação cênica, fitas de LED, lustres e segurança em instalações domésticas. Atendimento ágil e organizado.',
    city: 'São Paulo',
    neighborhood: 'Vila Mariana / Paraíso',
    rating: 5.0,
    totalReviews: 64,
    completedJobsCount: 98,
    basePriceNotice: 'A partir de R$ 100,00',
    availableToday: true,
    coordinates: { lat: -23.5852, lng: -46.6433 },
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prov-d',
    name: 'Roberto Silva',
    slug: 'roberto-silva-instalacoes',
    phone: '(11) 97345-1199',
    email: 'roberto.instalacoes@exemplo.com',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    facialVerified: true,
    facialVerificationDate: '2026-02-18',
    facialPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    documentVerified: true,
    documentType: 'CNH',
    documentPhotoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    category: 'Eletricista',
    specialtyTags: ['Troca de lâmpada e soquetes', 'Manutenção express', 'Rede 110v/220v', 'Disjuntores'],
    bio: 'Preço justo e atendimento no mesmo dia! Levo escada própria, lâmpadas de reposição e multímetro de precisão para testar toda a rede.',
    city: 'São Paulo',
    neighborhood: 'Perdizes / Pompéia',
    rating: 4.8,
    totalReviews: 45,
    completedJobsCount: 79,
    basePriceNotice: 'A partir de R$ 80,00',
    availableToday: false,
    coordinates: { lat: -23.5356, lng: -46.6749 },
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prov-jardim',
    name: 'Manoel Paisagismo & Jardinagem',
    slug: 'manoel-paisagismo',
    phone: '(11) 96452-9900',
    email: 'manoel.jardim@exemplo.com',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    facialVerified: true,
    facialVerificationDate: '2026-01-20',
    facialPhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    documentVerified: true,
    documentType: 'CNH',
    documentPhotoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    category: 'Jardineiro',
    specialtyTags: ['Corte de grama', 'Poda de árvores e cerca viva', 'Adubação', 'Limpeza pós-obra'],
    bio: 'Máquinas a gasolina profissionais, recolhimento completo de resíduos em sacos ecológicos e tratamento de gramados.',
    city: 'São Paulo',
    neighborhood: 'Morumbi / Butantã',
    rating: 4.9,
    totalReviews: 53,
    completedJobsCount: 110,
    basePriceNotice: 'A partir de R$ 130,00',
    availableToday: true,
    coordinates: { lat: -23.5989, lng: -46.7212 },
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1592417817098-8f3d69102353?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'prov-encanador',
    name: 'Adilson Hidráulica',
    slug: 'adilson-hidraulica-reparos',
    phone: '(11) 97711-2233',
    email: 'adilson.encanador@exemplo.com',
    role: 'provider',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    facialVerified: true,
    facialVerificationDate: '2026-02-12',
    facialPhotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    documentVerified: true,
    documentType: 'RG',
    documentPhotoUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=80',
    category: 'Encanador',
    specialtyTags: ['Desentupimento', 'Caça vazamentos', 'Troca de torneiras', 'Válvula de descarga'],
    bio: 'Mais de 15 anos resolvendo vazamentos sem quebrar piso quando possível. Detecção eletrônica e garantia.',
    city: 'São Paulo',
    neighborhood: 'Santana / Zona Norte',
    rating: 4.9,
    totalReviews: 78,
    completedJobsCount: 165,
    basePriceNotice: 'A partir de R$ 110,00',
    availableToday: true,
    coordinates: { lat: -23.5042, lng: -46.6294 },
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500&auto=format&fit=crop&q=80'
    ]
  }
];

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-1',
    clientId: 'client-1',
    clientName: 'Ana Clara Souza',
    clientPhone: '(11) 98765-4321',
    clientAddress: 'Rua Fradique Coutinho, 890 - Pinheiros, São Paulo - SP',
    clientCoordinates: { lat: -23.5598, lng: -46.6892 },
    title: 'Troca de 4 lâmpadas e verificação de soquete na sala de estar',
    description: 'Preciso trocar 4 lâmpadas de LED no forro de gesso da sala. Duas começaram a piscar e pararam de vez. O teto tem pé direito normal (cerca de 2,60m). Se possível realizar ainda esta semana.',
    category: 'Eletricista',
    mediaType: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
    status: 'quotes_received',
    createdAt: '2026-03-20T14:30:00Z',
    aiAnalysis: {
      category: 'Eletricista',
      serviceType: 'Troca de Lâmpadas Spot LED e Soquetes',
      urgency: 'Média',
      estimatedDuration: '1 hora',
      requiredTools: ['Escada de 5 degraus', 'Chave teste', 'Lâmpadas dicroicas/spots LED', 'Fita isolante'],
      technicalSummary: 'Substituição de 4 pontos de iluminação em forro de gesso com teste elétrico do barramento para eliminar curto ou oscilação de fase.',
      priceRangeEstimate: 'R$ 90 - R$ 160'
    },
    quotes: [
      {
        id: 'quote-b',
        requestId: 'req-1',
        providerId: 'prov-b',
        providerName: 'Carlos Mendes',
        providerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
        providerPhone: '(11) 99123-8844',
        providerRating: 4.9,
        providerJobsCount: 142,
        providerFacialVerified: true,
        providerDocVerified: true,
        price: 110,
        scheduledDate: '2026-03-22',
        scheduledTime: '10:00',
        estimatedDuration: '1h15m',
        message: 'Olá Ana! Posso realizar a troca das 4 lâmpadas e testo a voltagem de cada soquete para garantir que não volte a queimar. Levo escada própria protegida para não marcar o piso.',
        warrantyTerms: 'Garantia de 90 dias de mão de obra',
        status: 'pending',
        createdAt: '2026-03-20T15:10:00Z'
      },
      {
        id: 'quote-c',
        requestId: 'req-1',
        providerId: 'prov-c',
        providerName: 'Luciana Martins',
        providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        providerPhone: '(11) 98234-7711',
        providerRating: 5.0,
        providerJobsCount: 98,
        providerFacialVerified: true,
        providerDocVerified: true,
        price: 125,
        scheduledDate: '2026-03-21',
        scheduledTime: '14:30',
        estimatedDuration: '50 min',
        message: 'Consigo atender já amanhã à tarde! Faço a troca e revisão dos conectores wago. Se você ainda não comprou as lâmpadas, trago opções de LED bivolt 3000k ou 4000k com nota fiscal.',
        warrantyTerms: 'Garantia de 120 dias e suporte via WhatsApp',
        status: 'pending',
        createdAt: '2026-03-20T15:45:00Z'
      },
      {
        id: 'quote-d',
        requestId: 'req-1',
        providerId: 'prov-d',
        providerName: 'Roberto Silva',
        providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        providerPhone: '(11) 97345-1199',
        providerRating: 4.8,
        providerJobsCount: 79,
        providerFacialVerified: true,
        providerDocVerified: true,
        price: 90,
        scheduledDate: '2026-03-23',
        scheduledTime: '09:00',
        estimatedDuration: '1h',
        message: 'Melhor preço da região com serviço rápido e limpo. Troco as lâmpadas e ajusto as molas de fixação no gesso.',
        warrantyTerms: 'Garantia de 60 dias',
        status: 'pending',
        createdAt: '2026-03-20T16:20:00Z'
      }
    ]
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'req-1': [
    {
      id: 'msg-sys-1',
      requestId: 'req-1',
      senderId: 'system',
      senderName: 'Sistema ProServiços',
      senderRole: 'client',
      text: 'Orçamento aprovado pelo cliente! Canal direto de comunicação e geolocalização ativado.',
      timestamp: '16:30',
      isSystemUpdate: true
    },
    {
      id: 'msg-1',
      requestId: 'req-1',
      senderId: 'client-1',
      senderName: 'Ana Clara Souza',
      senderRole: 'client',
      text: 'Olá Carlos, fechei com você pelo app! O endereço está certinho na Fradique Coutinho.',
      timestamp: '16:32'
    },
    {
      id: 'msg-2',
      requestId: 'req-1',
      senderId: 'prov-b',
      senderName: 'Carlos Mendes',
      senderRole: 'provider',
      text: 'Perfeito Ana! Muito obrigado pela confiança. Estou preparando as ferramentas e a escada. Chego pontualmente no horário agendado.',
      timestamp: '16:35'
    }
  ]
};

export const CATEGORIES_LIST = [
  { id: 'Eletricista', name: 'Eletricista', icon: 'Zap', description: 'Troca de lâmpadas, fiação, tomadas, disjuntores e chuveiros' },
  { id: 'Jardineiro', name: 'Jardineiro', icon: 'Scissors', description: 'Corte de gramado, poda de cerca viva, adubação e limpeza' },
  { id: 'Encanador', name: 'Encanador', icon: 'Wrench', description: 'Vazamentos, desentupimento, torneiras e ralos' },
  { id: 'Pintor', name: 'Pintor', icon: 'Paintbrush', description: 'Paredes internas, externas, portões e acabamentos' },
  { id: 'Marceneiro', name: 'Marceneiro', icon: 'Hammer', description: 'Montagem de móveis, portas, armários e dobradiças' },
  { id: 'Limpeza / Diarista', name: 'Limpeza / Diarista', icon: 'Sparkles', description: 'Faxina residencial, comercial e pós-obra' },
  { id: 'Chaveiro', name: 'Chaveiro', icon: 'Key', description: 'Aberturas emergenciais, cópias e troca de segredos' },
  { id: 'Pedreiro', name: 'Pedreiro', icon: 'HardHat', description: 'Pequenos reparos, pisos, revestimentos e alvenaria' }
];

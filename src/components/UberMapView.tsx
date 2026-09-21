import React from 'react';
import { MapPin, Navigation, Car, Wrench, Zap, Scissors, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { UserProfile, ServiceRequest } from '../types';

interface UberMapViewProps {
  userLocation: { lat: number; lng: number; address: string };
  providers: UserProfile[];
  selectedCategory: string;
  activeRequest: ServiceRequest | null;
  selectedProvider: UserProfile | null;
  onSelectProviderPin: (provider: UserProfile) => void;
  isRadarActive: boolean;
  providerDistanceKm: number;
  providerEtaMinutes: number;
  serviceStep: 'idle' | 'radar' | 'quotes' | 'en_route' | 'in_progress' | 'completed';
}

export const UberMapView: React.FC<UberMapViewProps> = ({
  userLocation,
  providers,
  selectedCategory,
  activeRequest,
  selectedProvider,
  onSelectProviderPin,
  isRadarActive,
  providerDistanceKm,
  providerEtaMinutes,
  serviceStep
}) => {
  // Filter visible providers matching category
  const visibleProviders = providers.filter(
    (p) => selectedCategory === 'Todos' || !p.category || p.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  // Position calculation helpers for map canvas
  // Client is centered at (50%, 48%)
  const clientPos = { x: 50, y: 48 };

  // Offset positions for providers around the client
  const providerPositions: Record<string, { x: number; y: number; distance: string; eta: string }> = {
    'prov-b': { x: 38, y: 34, distance: '1.4 km', eta: '4 min' },
    'prov-c': { x: 62, y: 36, distance: '2.1 km', eta: '7 min' },
    'prov-d': { x: 44, y: 64, distance: '3.0 km', eta: '9 min' },
    'prov-jardim': { x: 70, y: 58, distance: '2.8 km', eta: '8 min' },
    'prov-encanador': { x: 30, y: 52, distance: '1.9 km', eta: '6 min' }
  };

  // Interpolated position for active tracking if provider is en route
  let activeCarPos: { x: number; y: number } = {
    x: providerPositions['prov-b']?.x || 38,
    y: providerPositions['prov-b']?.y || 34
  };
  if (selectedProvider && providerPositions[selectedProvider.id]) {
    activeCarPos = {
      x: providerPositions[selectedProvider.id].x,
      y: providerPositions[selectedProvider.id].y
    };
  }

  // If en route or in progress, move car closer to client
  if (serviceStep === 'en_route') {
    // 60% closer
    activeCarPos = {
      x: clientPos.x - (clientPos.x - activeCarPos.x) * (providerDistanceKm / 2.5),
      y: clientPos.y - (clientPos.y - activeCarPos.y) * (providerDistanceKm / 2.5)
    };
  } else if (serviceStep === 'in_progress' || serviceStep === 'completed') {
    activeCarPos = { x: clientPos.x - 3, y: clientPos.y + 2 };
  }

  return (
    <div className="relative w-full h-full min-h-[500px] bg-[#0f172a] overflow-hidden select-none">
      {/* Dynamic Uber Dark / Street Vector Map Background */}
      <div className="absolute inset-0 bg-[#111827]">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* Realistic Highway and Street paths */}
        <svg className="absolute inset-0 w-full h-full stroke-slate-700/60" strokeWidth="12" fill="none">
          {/* Main Avenue diagonal */}
          <path d="M -50 400 L 1200 150" strokeWidth="20" className="stroke-slate-800" />
          <path d="M -50 400 L 1200 150" strokeWidth="12" className="stroke-slate-700/80" />

          {/* Secondary streets */}
          <path d="M 200 -50 L 350 800" strokeWidth="10" className="stroke-slate-800" />
          <path d="M 600 -50 L 550 800" strokeWidth="14" className="stroke-slate-800" />
          <path d="M 600 -50 L 550 800" strokeWidth="8" className="stroke-slate-700/70" />

          {/* Neighborhood grids */}
          <path d="M 0 220 Q 400 300 1000 240" strokeWidth="6" className="stroke-slate-800" />
          <path d="M 50 500 Q 500 420 1100 520" strokeWidth="6" className="stroke-slate-800" />
          <path d="M 800 0 L 850 600" strokeWidth="6" className="stroke-slate-800" />
        </svg>

        {/* GPS Route path line between chosen provider and client */}
        {(serviceStep === 'en_route' || serviceStep === 'in_progress' || (selectedProvider && serviceStep === 'quotes')) && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
            {/* Glow under line */}
            <line
              x1={`${activeCarPos.x}%`}
              y1={`${activeCarPos.y}%`}
              x2={`${clientPos.x}%`}
              y2={`${clientPos.y}%`}
              stroke="#38bdf8"
              strokeWidth="10"
              strokeOpacity="0.25"
              strokeLinecap="round"
            />
            {/* Animated primary route line */}
            <line
              x1={`${activeCarPos.x}%`}
              y1={`${activeCarPos.y}%`}
              x2={`${clientPos.x}%`}
              y2={`${clientPos.y}%`}
              stroke="#0284c7"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="8,8"
              className="animate-pulse"
            />
          </svg>
        )}
      </div>

      {/* Radar Scanning Waves Animation (When client searches for providers) */}
      {isRadarActive && (
        <div
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: `${clientPos.x}%`, top: `${clientPos.y}%` }}
        >
          <div className="w-48 h-48 rounded-full border-2 border-sky-400/40 animate-ping" />
          <div className="absolute inset-0 -m-16 w-80 h-80 rounded-full border border-sky-500/30 animate-ping [animation-duration:2.5s]" />
          <div className="absolute inset-0 -m-32 w-[28rem] h-[28rem] rounded-full border border-sky-500/20 animate-pulse [animation-duration:3s]" />
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-sky-500/90 text-white font-mono text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg backdrop-blur-xs flex items-center gap-1.5 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            Radar Ativo: Notificando eletricistas no raio de 5 km...
          </div>
        </div>
      )}

      {/* User / Client Pin (Center) */}
      <div
        className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
        style={{ left: `${clientPos.x}%`, top: `${clientPos.y}%` }}
      >
        {/* Pulsing halo */}
        <div className="absolute -inset-3 bg-sky-500/30 rounded-full animate-ping pointer-events-none" />
        <div className="relative w-10 h-10 rounded-full bg-white border-3 border-sky-500 shadow-xl flex items-center justify-center text-sky-600">
          <div className="w-3.5 h-3.5 rounded-full bg-sky-600" />
        </div>
        {/* Pin label */}
        <div className="absolute top-11 left-1/2 -translate-x-1/2 bg-slate-900/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap shadow-lg border border-slate-700 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-sky-400" />
          <span>Você ({userLocation.address.split('-')[0].trim()})</span>
        </div>
      </div>

      {/* Providers Cars & Pins on the Map */}
      {visibleProviders.map((prov) => {
        const basePos = providerPositions[prov.id] || { x: 45, y: 35, distance: '1.8 km', eta: '5 min' };
        const pos = (serviceStep === 'en_route' && selectedProvider?.id === prov.id)
          ? { x: activeCarPos.x, y: activeCarPos.y, distance: `${providerDistanceKm} km`, eta: `${providerEtaMinutes} min` }
          : basePos;

        const isSelected = selectedProvider?.id === prov.id;

        return (
          <div
            key={prov.id}
            onClick={() => onSelectProviderPin(prov)}
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-700 group hover:scale-110 ${
              isSelected ? 'scale-110 z-30' : ''
            }`}
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            {/* Uber-like Car / Provider Beacon */}
            <div className="relative flex flex-col items-center">
              {/* Badge with Distance and ETA */}
              <div
                className={`mb-1 px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md transition whitespace-nowrap flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-white'
                    : 'bg-slate-900/90 text-white border border-slate-700'
                }`}
              >
                <span>{pos.eta}</span>
                <span className="opacity-60">•</span>
                <span>{pos.distance}</span>
              </div>

              {/* Vehicle / Specialist Marker */}
              <div
                className={`relative w-11 h-11 rounded-2xl p-0.5 shadow-xl transition flex items-center justify-center ${
                  isSelected
                    ? 'bg-amber-400 ring-4 ring-amber-400/30'
                    : 'bg-white hover:ring-2 hover:ring-white'
                }`}
              >
                <img
                  src={prov.avatar}
                  alt={prov.name}
                  className="w-full h-full rounded-[14px] object-cover"
                />

                {/* Category mini icon */}
                <div className="absolute -bottom-1 -right-1 bg-slate-900 text-amber-400 p-1 rounded-full shadow border border-slate-700 text-[10px]">
                  {prov.category === 'Eletricista' && <Zap className="w-2.5 h-2.5" />}
                  {prov.category === 'Jardineiro' && <Scissors className="w-2.5 h-2.5" />}
                  {prov.category === 'Encanador' && <Wrench className="w-2.5 h-2.5" />}
                  {!['Eletricista', 'Jardineiro', 'Encanador'].includes(prov.category || '') && (
                    <Car className="w-2.5 h-2.5" />
                  )}
                </div>

                {/* Verified badge */}
                {prov.facialVerified && (
                  <span className="absolute -top-1 -left-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              {/* Provider Name pill */}
              <div className="mt-1 bg-slate-900/90 text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap border border-slate-800 shadow">
                {prov.name.split(' ')[0]} • ⭐ {prov.rating}
              </div>
            </div>
          </div>
        );
      })}

      {/* Floating Map Controls / Legend */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-2 rounded-xl border border-slate-800 shadow-xl flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{visibleProviders.length} prestadores online no seu raio</span>
        </div>
      </div>

      {/* GPS Recenter Floating Button */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={() => {}}
          className="w-10 h-10 rounded-xl bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700 shadow-xl flex items-center justify-center transition"
          title="Centralizar na minha localização"
        >
          <Navigation className="w-4 h-4 text-sky-400" />
        </button>
      </div>
    </div>
  );
};

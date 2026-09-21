import React, { useState } from 'react';
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Share2,
  Copy,
  MapPin,
  Calendar,
  Award,
  Clock,
  ArrowLeft,
  QrCode,
  Zap,
  Check,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProviderMicroPageProps {
  provider: UserProfile;
  onRequestQuoteDirectly: (provider: UserProfile) => void;
  onBack?: () => void;
}

export const ProviderMicroPage: React.FC<ProviderMicroPageProps> = ({
  provider,
  onRequestQuoteDirectly,
  onBack
}) => {
  const [copied, setCopied] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const publicUrl = `${window.location.origin}/#p/${provider.slug || 'perfil'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top bar with back button & open link notice */}
        <div className="flex items-center justify-between">
          {onBack ? (
            <button
              onClick={onBack}
              className="py-2 px-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar para a Busca</span>
            </button>
          ) : <div />}

          {/* Share & Open Link Badge */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Micropágina Pública Aberta na Web
            </span>
            <button
              onClick={handleCopyLink}
              className="py-2 px-3.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copiado!' : 'Copiar Link Aberto'}</span>
            </button>
            <button
              onClick={() => setShowQrCode(!showQrCode)}
              className="py-2 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition shadow-xs"
              title="QR Code para Cartão de Visitas"
            >
              <QrCode className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* QR Code Modal preview */}
        {showQrCode && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg text-center space-y-3">
            <h4 className="text-sm font-bold text-slate-800">QR Code da Micropágina de {provider.name}</h4>
            <p className="text-xs text-slate-500">
              Ideal para imprimir em cartões de visita, adesivos de carro ou enviar para clientes.
            </p>
            <div className="w-44 h-44 mx-auto p-3 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center font-mono text-[10px] shadow-inner">
              <QrCode className="w-28 h-28 text-white mb-1" />
              <span>SCAN ME</span>
            </div>
            <p className="text-[11px] font-medium text-slate-600 truncate max-w-sm mx-auto">
              {publicUrl}
            </p>
          </div>
        )}

        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
          {/* Cover image banner */}
          <div className="h-36 sm:h-44 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 relative">
            <div className="absolute inset-0 bg-slate-900/15" />
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xs py-1 px-3 rounded-full text-xs font-bold text-slate-800 shadow">
              {provider.availableToday ? '🟢 Disponível Hoje' : '⚪ Sob Agendamento'}
            </div>
          </div>

          {/* Profile details */}
          <div className="px-6 pb-6 pt-0 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-14 mb-4 gap-4">
              <div className="relative inline-block">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                />
                {provider.facialVerified && (
                  <span
                    className="absolute bottom-1 right-1 bg-emerald-500 text-white rounded-full p-1.5 shadow"
                    title="Validação Facial Biométrica Aprovada"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
              </div>

              {/* Direct Request CTA */}
              <div className="flex items-center gap-2.5">
                <a
                  href={`https://wa.me/5511999999999?text=${encodeURIComponent(`Olá ${provider.name}, vi sua micropágina no ProServiços e gostaria de um orçamento.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
                <button
                  onClick={() => onRequestQuoteDirectly(provider)}
                  className="py-3 px-5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-amber-500/25 transition"
                >
                  <Zap className="w-4 h-4" />
                  <span>Solicitar Orçamento com {provider.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>

            {/* Name, category & trust badges */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{provider.name}</h1>
                <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  {provider.category}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current mr-1" />
                  {provider.rating} ({provider.totalReviews} avaliações)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  {provider.completedJobsCount} serviços realizados com sucesso
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  {provider.neighborhood}, {provider.city}
                </span>
              </div>

              {/* Verified Badges Banner */}
              <div className="flex flex-wrap gap-2 pt-2">
                {provider.facialVerified && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Identidade Facial Biométrica Verificada</span>
                  </div>
                )}
                {provider.documentVerified && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Documento Pessoal ({provider.documentType || 'RG/CNH'}) Homologado</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Sobre o Profissional
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {provider.bio}
              </p>
            </div>

            {/* Specialties tags */}
            {provider.specialtyTags && (
              <div className="mt-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Especialidades e Serviços Atendidos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.specialtyTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Price reference note */}
            {provider.basePriceNotice && (
              <div className="mt-4 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <div>
                  <span className="font-bold block">Preço de Referência:</span>
                  <span>{provider.basePriceNotice} (varia conforme complexidade e materiais)</span>
                </div>
                <button
                  onClick={() => onRequestQuoteDirectly(provider)}
                  className="font-bold text-amber-700 hover:underline"
                >
                  Consultar Orçamento →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Portfolio Gallery */}
        {provider.portfolioPhotos && provider.portfolioPhotos.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Galeria de Trabalhos Realizados ({provider.portfolioPhotos.length} fotos)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {provider.portfolioPhotos.map((photo, index) => (
                <div key={index} className="group relative rounded-2xl overflow-hidden border border-slate-200 aspect-video">
                  <img
                    src={photo}
                    alt={`Trabalho ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold">
                    Serviço Concluído
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Avaliações de Clientes Verificados ({provider.totalReviews})
            </h3>
            <span className="text-xs text-amber-600 font-bold flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" />
              {provider.rating} de média
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center">
                    M
                  </div>
                  <span className="text-xs font-bold text-slate-800">Mariana P.</span>
                </div>
                <div className="flex text-amber-500 text-xs">★★★★★</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Excelente profissional! Chegou pontualmente no horário agendado, trocou as 4 lâmpadas e identificou um fio solto na tomada. Deixou tudo limpo e testado."
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center">
                    F
                  </div>
                  <span className="text-xs font-bold text-slate-800">Fernando B.</span>
                </div>
                <div className="flex text-amber-500 text-xs">★★★★★</div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                "Preço justo e cumpriu a garantia prometida. Recomendo muito o trabalho."
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Box */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white text-center space-y-3 shadow-lg shadow-amber-500/20">
          <h3 className="text-lg font-bold">Precisa de um serviço elétrico ou reparo com segurança?</h3>
          <p className="text-xs text-amber-100 max-w-md mx-auto">
            Envie sua solicitação diretamente para {provider.name}. Resposta rápida com orçamento detalhado garantido pela ProServiços.
          </p>
          <button
            onClick={() => onRequestQuoteDirectly(provider)}
            className="py-3 px-6 rounded-xl bg-white text-amber-700 hover:bg-amber-50 font-extrabold text-sm shadow-md transition"
          >
            Solicitar Orçamento Agora
          </button>
        </div>
      </div>
    </div>
  );
};

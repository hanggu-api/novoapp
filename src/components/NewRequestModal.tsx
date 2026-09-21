import React, { useState, useRef } from 'react';
import {
  Mic,
  MicOff,
  Image as ImageIcon,
  Send,
  X,
  Sparkles,
  Bot,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  Play,
  Square,
  Wrench,
  DollarSign,
  Users
} from 'lucide-react';
import { ServiceRequest, AiRequestAnalysis, UserProfile } from '../types';

interface NewRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newRequest: ServiceRequest) => void;
  client: UserProfile;
  providers: UserProfile[];
  directProvider?: UserProfile | null;
}

export const NewRequestModal: React.FC<NewRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  client,
  providers,
  directProvider
}) => {
  const [title, setTitle] = useState(directProvider ? `Orçamento direto para ${directProvider.name}` : '');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('Rua Fradique Coutinho, 890 - Pinheiros, São Paulo - SP');
  const [mediaType, setMediaType] = useState<'photo' | 'video' | 'audio' | 'none'>('none');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // AI Analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AiRequestAnalysis | null>(null);
  const [dispatchedCount, setDispatchedCount] = useState<number>(0);
  const [matchedProviders, setMatchedProviders] = useState<UserProfile[]>([]);

  if (!isOpen) return null;

  // Start recording audio
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);
        setMediaType('audio');
        if (!description) {
          setDescription('Áudio gravado: "Olá, preciso trocar as lâmpadas do teto que queimaram e ver a fiação..."');
        }
      };

      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn("Audio mic permission error, using simulation:", err);
      // Simulation of audio note
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    } else {
      // Simulated audio note
      setRecordedAudioUrl('https://actions.google.com/sounds/v1/household/light_switch.ogg');
      setMediaType('audio');
      if (!description) {
        setDescription('Áudio do cliente: "Olá, estou precisando trocar 3 lâmpadas na sala e verificar uma tomada que está dando estalo."');
      }
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
  };

  const togglePlayAudio = () => {
    if (recordedAudioUrl) {
      if (!audioPlayerRef.current) {
        audioPlayerRef.current = new Audio(recordedAudioUrl);
        audioPlayerRef.current.onended = () => setIsPlayingAudio(false);
      }
      if (isPlayingAudio) {
        audioPlayerRef.current.pause();
        setIsPlayingAudio(false);
      } else {
        audioPlayerRef.current.play().catch(() => {});
        setIsPlayingAudio(true);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setMediaPreview(event.target?.result as string);
        setMediaType(file.type.startsWith('video') ? 'video' : 'photo');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetExample = (type: 'lampada' | 'grama' | 'vazamento') => {
    if (type === 'lampada') {
      setTitle('Troca de 4 lâmpadas LED e tomada da sala');
      setDescription('Quatro lâmpadas dicroicas no forro de gesso da sala pararam de funcionar. Uma tomada próxima começou a fazer faísca. Preciso de um eletricista que traga escada.');
      setMediaPreview('https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80');
      setMediaType('photo');
    } else if (type === 'grama') {
      setTitle('Corte de gramado e poda de cerca viva');
      setDescription('Grama do quintal cresceu bastante com as chuvas (aprox. 120m²). Preciso de jardineiro com máquina para cortar, aparar as bordas e recolher o entulho.');
      setMediaPreview('https://images.unsplash.com/photo-1592417817098-8f3d69102353?w=600&auto=format&fit=crop&q=80');
      setMediaType('photo');
    } else {
      setTitle('Vazamento constante na torneira da cozinha');
      setDescription('Torneira gourmet da pia da cozinha está pingando mesmo bem fechada e há umidade no armário abaixo da pia.');
      setMediaPreview('https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80');
      setMediaType('photo');
    }
  };

  const handleAnalyzeAndDispatch = async () => {
    if (!title && !description) {
      alert("Por favor, digite o título ou grave um áudio descrevendo o que precisa.");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Call backend AI analysis endpoint
      const response = await fetch('/api/analyze-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          mediaType,
          imageBase64: mediaPreview?.startsWith('data:image') ? mediaPreview : undefined
        })
      });

      const data = await response.json();
      const analysis: AiRequestAnalysis = data.analysis || {
        category: directProvider ? directProvider.category || 'Eletricista' : 'Eletricista',
        serviceType: 'Serviço Profissional',
        urgency: 'Média',
        estimatedDuration: '1 a 2 horas',
        requiredTools: ['Kit de ferramentas profissionais', 'Equipamento de medição'],
        technicalSummary: 'Solicitação analisada e direcionada para prestadores credenciados.',
        priceRangeEstimate: 'R$ 90 - R$ 180'
      };

      setAnalysisResult(analysis);

      // Match providers of that category
      const targetCategory = directProvider ? directProvider.category : analysis.category;
      const matching = providers.filter(p => !targetCategory || p.category?.toLowerCase() === targetCategory.toLowerCase());
      setMatchedProviders(matching.length > 0 ? matching : providers.slice(0, 3));
      setDispatchedCount(matching.length > 0 ? matching.length : 3);

    } catch (err) {
      console.error("Analysis failed:", err);
      // Fallback
      setAnalysisResult({
        category: directProvider?.category || 'Eletricista',
        serviceType: 'Manutenção e Troca de Lâmpadas',
        urgency: 'Média',
        estimatedDuration: '1 hora',
        requiredTools: ['Escada', 'Chave de teste', 'Lâmpadas adequadas'],
        technicalSummary: 'Solicitação classificada para prestadores da área elétrica.',
        priceRangeEstimate: 'R$ 80 - R$ 150'
      });
      setMatchedProviders(providers.slice(0, 3));
      setDispatchedCount(3);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirmAndBroadcast = () => {
    if (!analysisResult) return;

    const newRequest: ServiceRequest = {
      id: `req-${Date.now()}`,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone,
      clientAddress: address,
      clientCoordinates: { lat: -23.5598, lng: -46.6892 },
      title: title || `${analysisResult.serviceType}`,
      description: description || 'Solicitação enviada pelo cliente via ProServiços.',
      category: analysisResult.category,
      mediaType,
      mediaUrl: mediaPreview || undefined,
      audioBlobUrl: recordedAudioUrl || undefined,
      aiAnalysis: analysisResult,
      status: 'open',
      createdAt: new Date().toISOString(),
      quotes: [],
      directProviderId: directProvider ? directProvider.id : undefined
    };

    onSubmit(newRequest);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {directProvider ? `Pedir Orçamento Direto para ${directProvider.name}` : 'Solicitar Orçamento de Serviço'}
              </h3>
              <p className="text-xs text-slate-500">
                A IA analisa o seu pedido e notifica todos os profissionais verificados da categoria
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {!analysisResult ? (
            <>
              {/* Examples quick pills */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-600">
                    Preenchimento rápido de teste:
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handlePresetExample('lampada')}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-medium border border-amber-200 transition"
                  >
                    💡 Trocar Lâmpadas / Soquete
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetExample('grama')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-medium border border-emerald-200 transition"
                  >
                    🌱 Cortar Gramado / Poda
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetExample('vazamento')}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-medium border border-blue-200 transition"
                  >
                    🔧 Torneira / Vazamento
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  O que você precisa que seja feito?
                </label>
                <input
                  type="text"
                  placeholder="Ex: Trocar lâmpadas no teto da sala, cortar grama do jardim..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm font-medium text-slate-800"
                />
              </div>

              {/* Description / Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detalhes adicionais (anote observações ou medidas):
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Altura do teto, quantas peças são, se já tem as lâmpadas compradas..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-sm text-slate-800"
                />
              </div>

              {/* Audio and Photo Media Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Audio Recording */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Mic className="w-4 h-4 text-amber-600" />
                      Gravar Áudio Explicativo
                    </span>
                    {isRecording && (
                      <span className="text-[11px] font-bold text-red-600 animate-pulse flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-red-600" />
                        Gravando {recordingTime}s
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Grave a sua voz explicando o problema para quem prefere não digitar.
                  </p>

                  <div className="pt-1 flex items-center gap-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="py-2 px-3.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        Gravar Áudio
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="py-2 px-3.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-xs animate-pulse"
                      >
                        <Square className="w-3.5 h-3.5" />
                        Parar Gravação
                      </button>
                    )}

                    {recordedAudioUrl && !isRecording && (
                      <button
                        type="button"
                        onClick={togglePlayAudio}
                        className="py-2 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition"
                      >
                        <Play className="w-3.5 h-3.5" />
                        {isPlayingAudio ? 'Pausar' : 'Ouvir Áudio'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Photo / Video upload */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    Foto ou Vídeo do Local
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Ajuda os profissionais a darem um orçamento exato sem surpresas.
                  </p>

                  {mediaPreview ? (
                    <div className="relative rounded-lg overflow-hidden border border-slate-200 h-16 w-full bg-slate-800 flex items-center justify-between px-3">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img src={mediaPreview} alt="Anexo" className="w-12 h-12 object-cover rounded" />
                        <span className="text-xs text-white truncate">Foto anexada com sucesso</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setMediaPreview(null); setMediaType('none'); }}
                        className="text-xs text-red-300 hover:text-red-100"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <label className="py-2 px-3.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition w-fit">
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Tirar Foto / Carregar</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  Endereço do local do serviço:
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30 text-xs text-slate-800 font-medium"
                />
              </div>

              {/* Trigger AI Filter Button */}
              <button
                type="button"
                disabled={isAnalyzing}
                onClick={handleAnalyzeAndDispatch}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 hover:from-amber-700 hover:to-orange-600 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Bot className="w-5 h-5 animate-spin" />
                    <span>IA Analisando Pedido e Cruzando Especialistas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Analisar com IA e Localizar Prestadores</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* AI Analysis Screen */
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-200 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4" />
                    ANÁLISE INTELIGENTE CONCLUÍDA
                  </span>
                  <span className="text-xs font-semibold text-emerald-700">
                    Urgência: <strong>{analysisResult.urgency}</strong>
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-slate-800">
                    {analysisResult.serviceType}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {analysisResult.technicalSummary}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-100">
                    <span className="text-[11px] text-slate-500 block">Profissão Alvo:</span>
                    <strong className="text-slate-800 font-bold">{analysisResult.category}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-100">
                    <span className="text-[11px] text-slate-500 block">Tempo Estimado:</span>
                    <strong className="text-slate-800 font-bold">{analysisResult.estimatedDuration}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-emerald-100 col-span-2 sm:col-span-1">
                    <span className="text-[11px] text-slate-500 block">Faixa Média Mercado:</span>
                    <strong className="text-emerald-700 font-bold">{analysisResult.priceRangeEstimate}</strong>
                  </div>
                </div>

                {/* Tools */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Equipamentos e ferramentas necessárias identificadas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.requiredTools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[11px] text-slate-700 font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Matched Providers Notification Preview */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-amber-600" />
                    Profissionais que receberão seu pedido ({dispatchedCount}):
                  </span>
                  <span className="text-[11px] text-slate-500">Validados com Facial & Documento</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {matchedProviders.map((p) => (
                    <div key={p.id} className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center gap-2.5 shadow-xs">
                      <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-800 truncate">{p.name}</div>
                        <div className="text-[10px] text-slate-500">⭐ {p.rating} ({p.completedJobsCount} trab.)</div>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-slate-600 italic">
                  Eles analisarão as fotos e detalhes e enviarão os valores com as datas/horários disponíveis para você escolher.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAnalysisResult(null)}
                  className="w-1/3 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
                >
                  Editar Dados
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAndBroadcast}
                  className="w-2/3 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirmar e Disparar Orçamento</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

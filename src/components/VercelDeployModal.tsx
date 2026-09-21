import React, { useState, useEffect } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  X,
  Server,
  Zap,
  Code
} from 'lucide-react';

interface VercelDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelDeployModal: React.FC<VercelDeployModalProps> = ({ isOpen, onClose }) => {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [initResult, setInitResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkStatus();
    }
  }, [isOpen]);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/db-status');
      const data = await res.json();
      setDbStatus(data);
    } catch (e: any) {
      setDbStatus({
        status: 'simulated',
        vercelPostgresConnected: false,
        mode: 'in_memory_simulation',
        message: 'Modo local ativo com fallback de banco de dados.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInitDb = async () => {
    setInitLoading(true);
    setInitResult(null);
    try {
      const res = await fetch('/api/init-db', { method: 'POST' });
      const data = await res.json();
      setInitResult(data.message || 'Tabelas processadas com sucesso!');
      checkStatus();
    } catch (e: any) {
      setInitResult(`Erro: ${e.message}`);
    } finally {
      setInitLoading(false);
    }
  };

  const handleCopyDeployUrl = () => {
    navigator.clipboard.writeText('https://vercel.com/new');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-white overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center font-black">
              ▲
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white">
                Integração Vercel & Banco de Dados Postgres
              </h3>
              <p className="text-[11px] text-slate-400">
                Configuração para deploy e persistência serverless
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          {/* Status Box */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Status do Banco de Dados:</span>
              <button
                onClick={checkStatus}
                disabled={loading}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Atualizar</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  dbStatus?.vercelPostgresConnected
                    ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                    : 'bg-amber-400 shadow-lg shadow-amber-400/50'
                }`}
              />
              <div>
                <span className="text-sm font-bold text-white block">
                  {dbStatus?.vercelPostgresConnected
                    ? 'Vercel Postgres Ativo & Conectado'
                    : 'Modo de Simulação Ativo (Pronto para Vercel)'}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {dbStatus?.message || 'Configurado para aceitar POSTGRES_URL ao publicar na Vercel.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-900 text-[11px]">
              <div>
                <span className="text-slate-500 block">Provedor de Banco:</span>
                <strong className="text-slate-300">Vercel Postgres (Neon)</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Funções Serverless:</span>
                <strong className="text-slate-300">/api/analyze-request, /api/init-db</strong>
              </div>
            </div>
          </div>

          {/* Action to create tables */}
          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-400" />
                  Estrutura de Tabelas do App
                </h4>
                <p className="text-[11px] text-slate-400">
                  Cria as tabelas `users`, `service_requests`, `provider_quotes` e `chat_messages`.
                </p>
              </div>
              <button
                onClick={handleInitDb}
                disabled={initLoading}
                className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{initLoading ? 'Criando...' : 'Criar Tabelas'}</span>
              </button>
            </div>

            {initResult && (
              <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 text-[11px] font-mono border border-slate-800">
                {initResult}
              </div>
            )}
          </div>

          {/* Step by step instructions */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Como Publicar na Vercel em 3 Passos:
            </h4>
            <ol className="space-y-2 text-slate-300">
              <li className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  No menu do AI Studio, clique em <strong>Export to GitHub</strong> ou faça download do ZIP.
                </span>
              </li>
              <li className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Acesse <strong>vercel.com</strong>, clique em <strong>Add New Project</strong> e selecione seu repositório.
                </span>
              </li>
              <li className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white font-mono text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Na aba <strong>Storage</strong> na Vercel, clique em <strong>Create Postgres Database</strong> e conecte ao projeto!
                </span>
              </li>
            </ol>
          </div>

          {/* Action link */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <a
              href="https://vercel.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 transition shadow"
            >
              <span>Abrir Vercel Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

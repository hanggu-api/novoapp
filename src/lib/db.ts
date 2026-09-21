import { sql } from '@vercel/postgres';
import {
  UserProfile,
  ServiceRequest,
  ProviderQuote,
  ChatMessage
} from '../types';
import {
  INITIAL_PROVIDERS,
  INITIAL_REQUESTS,
  INITIAL_MESSAGES
} from '../data/mockData';

// Check if Vercel Postgres environment variable is configured
export const isVercelPostgresConfigured = (): boolean => {
  return !!process.env.POSTGRES_URL;
};

/**
 * Creates all necessary tables on Vercel Postgres (Neon)
 */
export async function initVercelDatabase() {
  if (!isVercelPostgresConfigured()) {
    console.log('ℹ️ [Vercel DB] POSTGRES_URL não detectada. Executando em modo de simulação resiliente.');
    return { success: true, mode: 'mock', message: 'Modo local ativo (POSTGRES_URL não configurada).' };
  }

  try {
    // 1. Users table (Clients & Providers)
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        role VARCHAR(50) NOT NULL,
        avatar TEXT,
        facial_verified BOOLEAN DEFAULT FALSE,
        facial_verification_date VARCHAR(50),
        facial_photo_url TEXT,
        document_verified BOOLEAN DEFAULT FALSE,
        document_type VARCHAR(20),
        document_photo_url TEXT,
        slug VARCHAR(255) UNIQUE,
        category VARCHAR(100),
        specialty_tags JSONB,
        bio TEXT,
        city VARCHAR(100),
        neighborhood VARCHAR(100),
        rating NUMERIC(3, 2) DEFAULT 5.0,
        total_reviews INT DEFAULT 0,
        completed_jobs_count INT DEFAULT 0,
        portfolio_photos JSONB,
        base_price_notice VARCHAR(255),
        available_today BOOLEAN DEFAULT TRUE,
        lat NUMERIC(10, 6),
        lng NUMERIC(10, 6),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Service Requests table
    await sql`
      CREATE TABLE IF NOT EXISTS service_requests (
        id VARCHAR(255) PRIMARY KEY,
        client_id VARCHAR(255) NOT NULL,
        client_name VARCHAR(255) NOT NULL,
        client_phone VARCHAR(50) NOT NULL,
        client_address TEXT NOT NULL,
        lat NUMERIC(10, 6),
        lng NUMERIC(10, 6),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        media_type VARCHAR(50) DEFAULT 'none',
        media_url TEXT,
        audio_blob_url TEXT,
        ai_analysis JSONB,
        status VARCHAR(50) DEFAULT 'open',
        selected_quote_id VARCHAR(255),
        direct_provider_id VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Provider Quotes table
    await sql`
      CREATE TABLE IF NOT EXISTS provider_quotes (
        id VARCHAR(255) PRIMARY KEY,
        request_id VARCHAR(255) NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
        provider_id VARCHAR(255) NOT NULL,
        provider_name VARCHAR(255) NOT NULL,
        provider_avatar TEXT,
        provider_phone VARCHAR(50),
        provider_rating NUMERIC(3, 2),
        provider_jobs_count INT,
        provider_facial_verified BOOLEAN,
        provider_doc_verified BOOLEAN,
        price NUMERIC(10, 2) NOT NULL,
        scheduled_date VARCHAR(50) NOT NULL,
        scheduled_time VARCHAR(50) NOT NULL,
        estimated_duration VARCHAR(50),
        message TEXT,
        warranty_terms VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 4. Chat Messages table
    await sql`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id VARCHAR(255) PRIMARY KEY,
        request_id VARCHAR(255) NOT NULL REFERENCES service_requests(id) ON DELETE CASCADE,
        sender_id VARCHAR(255) NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        sender_role VARCHAR(50) NOT NULL,
        text TEXT NOT NULL,
        timestamp VARCHAR(50) NOT NULL,
        is_location_share BOOLEAN DEFAULT FALSE,
        location_data JSONB,
        is_system_update BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    console.log('✅ [Vercel DB] Tabelas do Vercel Postgres criadas e verificadas com sucesso!');
    return { success: true, mode: 'vercel_postgres', message: 'Tabelas criadas com sucesso no Vercel Postgres!' };
  } catch (error) {
    console.error('❌ [Vercel DB] Erro ao inicializar tabelas:', error);
    return { success: false, error: String(error) };
  }
}

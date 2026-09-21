import { sql } from '@vercel/postgres';

export default async function handler(req: any, res: any) {
  if (!process.env.POSTGRES_URL) {
    return res.status(200).json({
      success: true,
      mode: 'mock',
      message: 'Modo de simulação ativo. Vincule um banco Vercel Postgres nas configurações da Vercel para persistência na nuvem.'
    });
  }

  try {
    // 1. Users table
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

    // 2. Service requests table
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

    // 3. Provider quotes table
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

    // 4. Chat messages table
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

    return res.status(200).json({
      success: true,
      mode: 'vercel_postgres',
      message: 'Tabelas criadas com sucesso no Vercel Postgres!'
    });
  } catch (error: any) {
    console.error('Vercel DB Init Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

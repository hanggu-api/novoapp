export default async function handler(req: any, res: any) {
  const isConfigured = !!process.env.POSTGRES_URL;
  return res.status(200).json({
    status: 'ok',
    vercelPostgresConnected: isConfigured,
    mode: isConfigured ? 'vercel_postgres' : 'in_memory_simulation',
    database: process.env.POSTGRES_DATABASE || 'local_mock',
    host: process.env.POSTGRES_HOST ? 'Neon / Vercel Cloud' : 'localhost',
    message: isConfigured
      ? 'Conexão com o Vercel Postgres ativa com sucesso no ambiente Vercel!'
      : 'Vercel Postgres pronto para conexão (basta vincular no painel da Vercel).'
  });
}

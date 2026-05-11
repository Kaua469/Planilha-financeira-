import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Se as chaves não existirem (ex: durante o build da Vercel), 
  // retornamos um cliente "vazio" apenas para não quebrar a compilação.
  if (!url || !key) {
    return {} as any
  }

  return createBrowserClient(url, key)
}

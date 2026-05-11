import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Se não estiver no navegador (ou seja, está no build da Vercel), 
  // retornamos um objeto seguro que não quebra a compilação.
  if (typeof window === 'undefined') {
    return {} as any
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  return createBrowserClient(url, key)
}

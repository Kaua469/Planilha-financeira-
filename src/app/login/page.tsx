"use client"

import React from 'react'
import { Logo } from '@/components/layout/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function LoginPage() {
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      toast.error(error.message)
      setLoading(false)
      return
    }

    toast.success('Login realizado com sucesso!')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#07090D] flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-[#151924] border-[#242938] shadow-2xl">
        <CardContent className="p-8">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">Bem-vindo de volta</h2>
          <p className="text-[#9BA3AF] text-center mb-8">Acesse sua conta para gerenciar suas finanças.</p>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[#F5F7FA]">Email</Label>
              <Input 
                name="email"
                type="email" 
                placeholder="seu@email.com" 
                required
                className="bg-[#0F1117] border-[#242938] text-white h-12 focus:border-[#C80313]"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-[#F5F7FA]">Senha</Label>
                <Link href="/forgot-password" className="text-xs text-[#C80313] hover:underline">
                  Esqueceu a senha?
                </Link>
              </div>
              <Input 
                name="password"
                type="password" 
                placeholder="••••••••" 
                required
                className="bg-[#0F1117] border-[#242938] text-white h-12 focus:border-[#C80313]"
              />
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#C80313] hover:bg-[#E1061B] text-white font-bold shadow-[0_0_15px_rgba(200,3,19,0.3)]"
            >
              {loading ? 'ENTRANDO...' : 'ENTRAR'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-[#9BA3AF]">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-[#C80313] font-bold hover:underline">
              Crie uma agora
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

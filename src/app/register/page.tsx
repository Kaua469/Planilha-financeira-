"use client"

import React, { useState } from 'react'
import { Logo } from '@/components/layout/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Mail } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string

    // Validação de Senha Forte
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)) {
      toast.error('A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name }
      }
    })

    if (error) {
      toast.error('Erro ao cadastrar: ' + error.message)
      setLoading(false)
      return
    }

    toast.success('Cadastro realizado com sucesso!')
    setIsRegistered(true)
  }

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-[#0F1117] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#151924] border border-[#242938] rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
            <Mail className="text-emerald-500" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Verifique seu e-mail</h2>
          <p className="text-[#9BA3AF] leading-relaxed">
            Enviamos um link de confirmação para o seu e-mail. Por favor, clique no link para ativar sua conta e acessar o Kadron Finance.
          </p>
          <Button 
            onClick={() => router.push('/login')}
            className="w-full bg-[#C80313] hover:bg-[#E1061B] h-14 rounded-2xl font-bold text-lg"
          >
            IR PARA LOGIN
          </Button>
          <p className="text-xs text-[#9BA3AF]">
            Não recebeu? Verifique sua caixa de spam ou lixo eletrônico.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#07090D] flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-[#151924] border-[#242938] shadow-2xl">
        <CardContent className="p-8">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">Crie sua conta premium</h2>
          <p className="text-[#9BA3AF] text-center mb-8">Comece hoje a transformar sua gestão financeira.</p>

          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[#F5F7FA]">Nome Completo</Label>
              <Input 
                name="full_name"
                type="text" 
                placeholder="Seu nome" 
                required
                className="bg-[#0F1117] border-[#242938] text-white h-12 focus:border-[#C80313]"
              />
            </div>

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
              <Label className="text-[#F5F7FA]">Senha</Label>
              <Input 
                name="password"
                type="password" 
                placeholder="••••••••" 
                required
                className="bg-[#0F1117] border-[#242938] text-white h-12 focus:border-[#C80313]"
              />
              <p className="text-xs text-[#9BA3AF] mt-1">
                A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número.
              </p>
            </div>

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#C80313] hover:bg-[#E1061B] text-white font-bold shadow-[0_0_15px_rgba(200,3,19,0.3)]"
            >
              {loading ? 'CRIANDO CONTA...' : 'CRIAR CONTA'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-[#9BA3AF]">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-[#C80313] font-bold hover:underline">
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

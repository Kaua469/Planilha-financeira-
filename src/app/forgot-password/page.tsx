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
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const supabase = createClient()

  async function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    // O redirectTo é importante. Use window.location.origin para pegar a URL atual (localhost ou Vercel)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      toast.error('Erro ao enviar e-mail: ' + error.message)
      setLoading(false)
      return
    }

    toast.success('E-mail de recuperação enviado!')
    setIsSent(true)
  }

  if (isSent) {
    return (
      <div className="min-h-screen bg-[#07090D] flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-[#151924] border-[#242938] shadow-2xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
              <Mail className="text-emerald-500" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verifique seu e-mail</h2>
            <p className="text-[#9BA3AF] mb-8">
              Enviamos as instruções de recuperação para o seu e-mail.
            </p>
            <Link href="/login">
              <Button className="w-full h-12 bg-[#C80313] hover:bg-[#E1061B] text-white font-bold">
                VOLTAR PARA O LOGIN
              </Button>
            </Link>
          </CardContent>
        </Card>
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
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">Recuperar Senha</h2>
          <p className="text-[#9BA3AF] text-center mb-8">
            Digite seu e-mail para receber um link de redefinição de senha.
          </p>

          <form onSubmit={handleResetPassword} className="space-y-6">
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

            <Button 
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#C80313] hover:bg-[#E1061B] text-white font-bold shadow-[0_0_15px_rgba(200,3,19,0.3)]"
            >
              {loading ? 'ENVIANDO...' : 'ENVIAR LINK'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm text-[#9BA3AF]">
            Lembrou da senha?{" "}
            <Link href="/login" className="text-[#C80313] font-bold hover:underline">
              Fazer login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import React, { useState } from 'react'
import { Logo } from '@/components/layout/logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleUpdatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string

    // Validação da Senha Forte
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)) {
      toast.error('A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma minúscula e um número.')
      setLoading(false)
      return
    }

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      toast.error('Erro ao redefinir senha: ' + error.message)
      setLoading(false)
      return
    }

    toast.success('Senha atualizada com sucesso!')
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#07090D] flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-[#151924] border-[#242938] shadow-2xl">
        <CardContent className="p-8">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>
          
          <h2 className="text-2xl font-bold text-white text-center mb-2">Nova Senha</h2>
          <p className="text-[#9BA3AF] text-center mb-8">
            Crie uma nova senha forte para sua conta.
          </p>

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[#F5F7FA]">Nova Senha</Label>
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
              {loading ? 'ATUALIZANDO...' : 'ATUALIZAR SENHA'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

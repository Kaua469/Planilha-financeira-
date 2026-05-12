"use client"

import React, { useEffect, useState, useRef } from 'react'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Shield, User, Bell, CreditCard } from "lucide-react"
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'subscription'>('profile')
  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClient()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      toast.error('Usuário não autenticado')
      setLoading(false)
      return
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Math.random()}.${fileExt}`
    const filePath = `${fileName}`

    // Fazendo upload para o bucket 'avatars'
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) {
      toast.error('Erro! Você criou o bucket "avatars" no painel do Supabase como Public?')
      setLoading(false)
      return
    }

    // Pegar URL pública
    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath)
    
    // Atualizar perfil
    const { error: updateError } = await supabase.from('profiles').update({
      avatar_url: urlData.publicUrl
    }).eq('id', user.id)

    if (updateError) {
      toast.error('Erro ao salvar avatar no perfil')
    } else {
      toast.success('Avatar atualizado com sucesso!')
      fetchProfile()
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setFullName(data?.full_name || '')
    }
  }

  async function handleUpdateProfile() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('profiles').update({
      full_name: fullName
    }).eq('id', user?.id)

    if (error) {
      toast.error('Erro ao atualizar perfil')
    } else {
      toast.success('Perfil atualizado com sucesso!')
      fetchProfile()
    }
    setLoading(false)
  }

  async function handleUpdatePlan(newPlan: string) {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('profiles').update({
      plan: newPlan
    }).eq('id', user?.id)

    if (error) {
      toast.error('Erro ao atualizar plano')
    } else {
      toast.success(`Plano ${newPlan.toUpperCase()} ativado com sucesso!`)
      fetchProfile()
    }
    setLoading(false)
  }

  async function handleDeleteAccount() {
    const confirm = window.confirm('TEM CERTEZA? Esta ação é irreversível e todos os seus dados serão apagados.')
    if (!confirm) return

    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    const { error } = await supabase.from('profiles').delete().eq('id', user?.id)
    
    if (error) {
      toast.error('Erro ao excluir conta')
    } else {
      await supabase.auth.signOut()
      toast.success('Conta excluída com sucesso.')
      router.push('/register')
    }
    setLoading(false)
  }

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Configurações</h1>
          <p className="text-sm sm:text-base text-[#9BA3AF]">Gerencie seu ecossistema financeiro.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-8">
          {/* Tabs - horizontal scroll on mobile, vertical on desktop */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:space-y-0">
            <Button 
              onClick={() => setActiveTab('profile')}
              variant="ghost" 
              className={cn(
                "justify-start transition-all whitespace-nowrap flex-shrink-0",
                activeTab === 'profile' ? "text-white bg-[#151924] border-l-0 lg:border-l-2 border-b-2 lg:border-b-0 border-[#C80313]" : "text-[#9BA3AF] hover:text-white"
              )}
            >
              <User className="mr-2" size={18} /> Perfil
            </Button>
            <Button 
              onClick={() => setActiveTab('security')}
              variant="ghost" 
              className={cn(
                "justify-start transition-all whitespace-nowrap flex-shrink-0",
                activeTab === 'security' ? "text-white bg-[#151924] border-l-0 lg:border-l-2 border-b-2 lg:border-b-0 border-[#C80313]" : "text-[#9BA3AF] hover:text-white"
              )}
            >
              <Shield className="mr-2" size={18} /> Segurança
            </Button>
            <Button 
              onClick={() => setActiveTab('subscription')}
              variant="ghost" 
              className={cn(
                "justify-start transition-all whitespace-nowrap flex-shrink-0",
                activeTab === 'subscription' ? "text-white bg-[#151924] border-l-0 lg:border-l-2 border-b-2 lg:border-b-0 border-[#C80313]" : "text-[#9BA3AF] hover:text-white"
              )}
            >
              <CreditCard className="mr-2" size={18} /> Assinatura
            </Button>
          </div>

          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'profile' && (
              <Card className="bg-[#151924] border-[#242938] animate-in fade-in slide-in-from-bottom-4 duration-500">
                <CardHeader>
                  <CardTitle className="text-white">Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <Avatar className="w-20 h-20 border-2 border-[#242938]">
                      {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt="Avatar" className="object-cover" />}
                      <AvatarFallback className="bg-[#C80313] text-2xl">
                        {fullName?.substring(0, 2).toUpperCase() || 'KB'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleAvatarUpload} 
                      />
                      <Button onClick={() => fileInputRef.current?.click()} disabled={loading} size="sm" className="bg-[#C80313] hover:bg-[#E1061B]">
                        {loading ? 'Enviando...' : 'Alterar Avatar'}
                      </Button>
                      <p className="text-xs text-[#9BA3AF]">JPG ou PNG. Máximo de 2MB.</p>
                    </div>
                  </div>
                  <Separator className="bg-[#242938]" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[#F5F7FA]">Nome Completo</Label>
                      <Input 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        className="bg-[#0F1117] border-[#242938] text-white focus:border-[#C80313]" 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[#F5F7FA]">Email</Label>
                      <Input value={profile?.email || ''} disabled className="bg-[#0F1117] border-[#242938] text-[#9BA3AF]" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button disabled={loading} onClick={handleUpdateProfile} className="bg-[#C80313] hover:bg-[#E1061B] px-8 h-12 rounded-xl">
                      {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="bg-[#151924] border-[#242938]">
                  <CardHeader>
                    <CardTitle className="text-white">Alterar Senha</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[#F5F7FA]">Nova Senha</Label>
                      <Input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="bg-[#0F1117] border-[#242938] text-white focus:border-[#C80313]" 
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button disabled={loading || !password} onClick={() => {
                        supabase.auth.updateUser({ password }).then(() => {
                          toast.success('Senha alterada!')
                          setPassword('')
                        })
                      }} className="bg-[#C80313] hover:bg-[#E1061B] px-8 h-12 rounded-xl">
                        Atualizar Senha
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-[#151924] border-red-500/20 border">
                  <CardHeader>
                    <CardTitle className="text-red-500">Excluir Conta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#9BA3AF] text-sm mb-6">Esta ação apagará permanentemente todos os seus dados e transações.</p>
                    <Button onClick={handleDeleteAccount} variant="destructive" className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 px-8 h-12 rounded-xl transition-all">
                      EXCLUIR MINHA CONTA AGORA
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'subscription' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {[
                  { name: 'free', title: 'Kadron Free', price: 'R$ 0', features: ['Até 50 transações/mês', 'Dashboard Básico', 'Suporte Comum'] },
                  { name: 'pro', title: 'Kadron Pro', price: 'R$ 49', features: ['Transações Ilimitadas', 'AI Insights', 'Suporte Prioritário', 'Relatórios PDF'] }
                ].map((plan) => (
                  <Card key={plan.name} className={cn(
                    "bg-[#151924] border-2 transition-all cursor-pointer group relative overflow-hidden",
                    profile?.plan === plan.name ? "border-[#C80313]" : "border-[#242938] hover:border-[#C80313]/50"
                  )}>
                    {profile?.plan === plan.name && (
                      <div className="absolute top-0 right-0 bg-[#C80313] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-widest">Ativo</div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-white text-xl">{plan.title}</CardTitle>
                      <div className="text-3xl font-bold mt-2">{plan.price}<span className="text-sm text-[#9BA3AF] font-normal">/mês</span></div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map(f => (
                          <li key={f} className="text-sm text-[#9BA3AF] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-[#C80313] rounded-full" /> {f}
                          </li>
                        ))}
                      </ul>
                      <Button 
                        disabled={loading || profile?.plan === plan.name}
                        onClick={() => handleUpdatePlan(plan.name)}
                        className={cn(
                          "w-full h-12 rounded-xl font-bold",
                          profile?.plan === plan.name ? "bg-[#242938] text-[#9BA3AF]" : "bg-[#C80313] hover:bg-[#E1061B] text-white"
                        )}
                      >
                        {profile?.plan === plan.name ? 'PLANO ATUAL' : 'SELECIONAR PLANO'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

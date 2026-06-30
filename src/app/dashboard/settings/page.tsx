"use client"

import React, { useEffect, useState, useRef, Suspense } from 'react'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Shield, User, Bell, CreditCard } from "lucide-react"
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useSubscription } from '@/hooks/useSubscription'
import { PLAN_DETAILS, PlanType } from '@/types/subscription'
import { paymentService } from '@/services/payment'
import { Check } from 'lucide-react'

function SettingsContent() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'subscription'>('profile')
  
  useEffect(() => {
    if (tabParam === 'profile' || tabParam === 'security' || tabParam === 'subscription') {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const [profile, setProfile] = useState<any>(null)
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const supabase = createClient()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { subscription, isPro, refresh: refreshSub } = useSubscription()

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

  async function handleUpdatePlan(newPlan: PlanType) {
    setLoading(true)
    if (newPlan === 'pro') {
      router.push('/dashboard/checkout?plan=pro')
      setLoading(false)
      return
    }

    const res = await paymentService.processCheckout('free')
    if (res.success) {
      toast.success('Plano Gratuito ativado!')
      refreshSub()
      fetchProfile()
    } else {
      toast.error(res.error || 'Erro ao atualizar plano')
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                {/* Plano Gratuito */}
                <Card className={cn(
                  "bg-[#151924] border-2 transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] flex flex-col justify-between",
                  !isPro ? "border-[#C80313] shadow-[0_0_20px_rgba(200,3,19,0.15)]" : "border-[#242938] hover:border-[#C80313]/30"
                )}>
                  {!isPro && (
                    <div className="absolute top-0 right-0 bg-[#C80313] text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-widest">
                      Ativo
                    </div>
                  )}
                  <div>
                    <CardHeader className="p-6">
                      <CardTitle className="text-white text-xl sm:text-2xl font-bold">{PLAN_DETAILS.free.name}</CardTitle>
                      <div className="text-3xl font-extrabold text-white mt-2 flex items-baseline gap-1">
                        {PLAN_DETAILS.free.price}
                        <span className="text-xs text-[#9BA3AF] font-normal uppercase tracking-wider">/mês</span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <ul className="space-y-3.5">
                        {PLAN_DETAILS.free.features.map(f => (
                          <li key={f} className="text-sm text-[#9BA3AF] flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </div>
                  <CardContent className="px-6 pb-6 pt-0 mt-6">
                    <Button 
                      disabled={loading || !isPro}
                      onClick={() => handleUpdatePlan('free')}
                      className={cn(
                        "w-full h-12 rounded-xl font-bold transition-all",
                        !isPro 
                          ? "bg-[#242938] text-[#9BA3AF] cursor-not-allowed" 
                          : "bg-transparent border border-[#242938] text-white hover:bg-[#151924] hover:border-[#C80313]"
                      )}
                    >
                      {!isPro ? 'PLANO ATUAL' : PLAN_DETAILS.free.buttonText}
                    </Button>
                  </CardContent>
                </Card>

                {/* Plano Pro (Destacado) */}
                <Card className={cn(
                  "bg-[#151924] border-2 transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] flex flex-col justify-between",
                  isPro 
                    ? "border-[#C80313] shadow-[0_0_30px_rgba(200,3,19,0.3)]" 
                    : "border-[#242938] hover:border-[#C80313]/60 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                )}>
                  {/* Selo Popular */}
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#C80313] to-red-500 text-white text-[9px] font-bold px-3.5 py-1.5 rounded-bl-lg uppercase tracking-wider flex items-center gap-1 shadow-md">
                    {PLAN_DETAILS.pro.badge}
                  </div>

                  <div>
                    <CardHeader className="p-6">
                      <CardTitle className="text-white text-xl sm:text-2xl font-bold flex items-center gap-2">
                        {PLAN_DETAILS.pro.name}
                      </CardTitle>
                      <div className="text-3xl font-extrabold text-white mt-2 flex items-baseline gap-1">
                        {PLAN_DETAILS.pro.price}
                        <span className="text-xs text-[#9BA3AF] font-normal uppercase tracking-wider">/mês</span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <ul className="space-y-3.5">
                        {PLAN_DETAILS.pro.features.map(f => (
                          <li key={f} className="text-sm text-[#F5F7FA] flex items-start gap-2.5 font-medium">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </div>
                  <CardContent className="px-6 pb-6 pt-0 mt-6">
                    <Button 
                      disabled={loading || isPro}
                      onClick={() => handleUpdatePlan('pro')}
                      className={cn(
                        "w-full h-12 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(200,3,19,0.2)]",
                        isPro 
                          ? "bg-[#242938] text-[#9BA3AF] cursor-not-allowed" 
                          : "bg-[#C80313] hover:bg-[#E1061B] text-white hover:shadow-[0_0_25px_rgba(200,3,19,0.4)]"
                      )}
                    >
                      {isPro ? 'PLANO ATUAL' : PLAN_DETAILS.pro.buttonText}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="text-center text-[#9BA3AF] py-12 animate-pulse">Carregando configurações...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

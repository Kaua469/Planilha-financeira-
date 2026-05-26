"use client"

export const dynamic = 'force-dynamic'

import React, { useEffect, useState } from 'react'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus, Users, Search, CheckCircle2, XCircle, Trash2, DollarSign } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from '@/lib/utils'
import { useFinancial } from '@/lib/context/financial-context'

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [editingSub, setEditingSub] = useState<any>(null)
  const { context } = useFinancial()
  const supabase = createClient()

  useEffect(() => {
    fetchSubs()
  }, [context])

  async function fetchSubs() {
    setLoading(true)
    const { data, error } = await supabase
      .from('client_subscriptions')
      .select('*')
      .eq('context', context)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar assinaturas')
    } else {
      setSubs(data || [])
    }
    setLoading(false)
  }

  async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid'
    const { error } = await supabase
      .from('client_subscriptions')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) toast.error('Erro ao atualizar status')
    else fetchSubs()
  }

  async function deleteSub(id: string) {
    if (!window.confirm('Excluir este participante?')) return
    const { error } = await supabase.from('client_subscriptions').delete().eq('id', id)
    if (error) toast.error('Erro ao excluir')
    else fetchSubs()
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const { data: { user } } = await supabase.auth.getUser()

    const payload = {
      user_id: user?.id,
      client_name: formData.get('name'),
      amount: parseFloat(formData.get('amount') as string),
      due_date: formData.get('due_date'), // Agora é data completa
      status: editingSub ? editingSub.status : 'pending',
      context: context
    }

    let error
    if (editingSub) {
      const { error: err } = await supabase
        .from('client_subscriptions')
        .update(payload)
        .eq('id', editingSub.id)
      error = err
    } else {
      const { error: err } = await supabase
        .from('client_subscriptions')
        .insert(payload)
      error = err
    }

    if (error) toast.error('Erro ao processar: ' + error.message)
    else {
      toast.success(editingSub ? 'Atualizado!' : 'Cadastrado!')
      setOpen(false)
      setEditingSub(null)
      fetchSubs()
    }
    setLoading(false)
  }

  const filteredSubs = subs.filter(s => 
    s.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalToReceive = subs.reduce((acc, s) => acc + Number(s.amount), 0)
  const totalPaid = subs.filter(s => s.status === 'paid').reduce((acc, s) => acc + Number(s.amount), 0)

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Gestão de Assinaturas</h1>
            <p className="text-sm sm:text-base text-[#9BA3AF]">Controle de participantes e recebimentos recorrentes.</p>
          </div>
          
          <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) setEditingSub(null)
          }}>
            <DialogTrigger asChild>
              <Button className="bg-[#C80313] hover:bg-[#E1061B] text-white rounded-xl px-6 py-6 shadow-[0_0_20px_rgba(200,3,19,0.3)]">
                <Plus className="mr-2" size={20} /> NOVO PARTICIPANTE
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#151924] border-[#242938] text-white">
              <DialogHeader>
                <DialogTitle>{editingSub ? 'Editar Participante' : 'Adicionar Participante'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Nome do Participante</Label>
                  <Input 
                    name="name" 
                    defaultValue={editingSub?.client_name || ''}
                    placeholder="Ex: João Silva" 
                    className="bg-[#0F1117] border-[#242938]" required 
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <Input 
                      name="amount" 
                      type="number" 
                      step="0.01" 
                      defaultValue={editingSub?.amount || ''}
                      placeholder="0.00" 
                      className="bg-[#0F1117] border-[#242938]" required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Data de Vencimento</Label>
                    <Input 
                      name="due_date" 
                      type="date" 
                      defaultValue={editingSub?.due_date || ''}
                      className="bg-[#0F1117] border-[#242938] [color-scheme:dark]" required 
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-[#C80313] hover:bg-[#E1061B] py-6 mt-4">
                  {loading ? 'PROCESSANDO...' : editingSub ? 'SALVAR ALTERAÇÕES' : 'CADASTRAR'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#151924] border border-[#242938] rounded-2xl p-6 flex items-center gap-6">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-[#9BA3AF] text-sm uppercase font-bold tracking-wider">Já Recebido</p>
              <p className="text-2xl font-bold text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPaid)}
              </p>
            </div>
          </div>
          <div className="bg-[#151924] border border-[#242938] rounded-2xl p-6 flex items-center gap-6">
            <div className="w-12 h-12 bg-[#C80313]/10 rounded-xl flex items-center justify-center text-[#C80313]">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[#9BA3AF] text-sm uppercase font-bold tracking-wider">Total Previsto</p>
              <p className="text-2xl font-bold text-white">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalToReceive)}
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA3AF]" size={18} />
          <Input 
            placeholder="Buscar participante..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#151924] border-[#242938] text-white"
          />
        </div>

        <div className="bg-[#151924] border border-[#242938] rounded-2xl overflow-hidden shadow-xl">
          {loading && subs.length === 0 ? (
            <div className="p-12 text-center text-[#9BA3AF]">Carregando participantes...</div>
          ) : filteredSubs.length === 0 ? (
            <div className="p-24 text-center text-[#9BA3AF]">Nenhum participante cadastrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#242938] bg-[#0F1117]/50">
                    <th className="p-4 text-xs font-bold text-[#9BA3AF] uppercase tracking-wider">Nome</th>
                    <th className="p-4 text-xs font-bold text-[#9BA3AF] uppercase tracking-wider">Vencimento</th>
                    <th className="p-4 text-xs font-bold text-[#9BA3AF] uppercase tracking-wider">Valor</th>
                    <th className="p-4 text-xs font-bold text-[#9BA3AF] uppercase tracking-wider">Status</th>
                    <th className="p-4 text-xs font-bold text-[#9BA3AF] uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242938]">
                  {filteredSubs.map((s) => (
                    <tr key={s.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 font-medium text-white">{s.client_name}</td>
                      <td className="p-4 text-[#9BA3AF]">
                        {s.due_date ? new Date(s.due_date).toLocaleDateString('pt-BR') : 'Sem data'}
                      </td>
                      <td className="p-4 font-bold text-white">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.amount)}
                      </td>
                      <td className="p-4">
                        <button 
                          onClick={() => toggleStatus(s.id, s.status)}
                          className={cn(
                            "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all",
                            s.status === 'paid' 
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                              : "bg-[#C80313]/10 text-[#C80313] border border-[#C80313]/20"
                          )}
                        >
                          {s.status === 'paid' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {s.status === 'paid' ? 'PAGO' : 'PENDENTE'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => {
                              setEditingSub(s)
                              setOpen(true)
                            }}
                            className="text-[#9BA3AF] hover:text-white transition-colors p-2"
                          >
                            <Plus size={18} className="rotate-45" /> {/* Usei um ícone de edit improvisado ou similar */}
                            <span className="sr-only">Editar</span>
                          </button>
                          <button onClick={() => deleteSub(s.id)} className="text-[#9BA3AF] hover:text-[#C80313] transition-colors p-2">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}

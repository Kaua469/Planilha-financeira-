"use client"

export const dynamic = 'force-dynamic'

import React, { useEffect, useState } from 'react'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Button } from "@/components/ui/button"
import { CreditCard, Search, CheckCircle2, AlertCircle, Trash2, Calendar, ArrowDownUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useFinancial } from '@/lib/context/financial-context'

export default function CreditCardPage() {
  const [installments, setInstallments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedMonth, setSelectedMonth] = useState('all')

  const { context } = useFinancial()
  const supabase = createClient()

  useEffect(() => {
    fetchInstallments()
  }, [context])

  async function fetchInstallments() {
    setLoading(true)
    const { data, error } = await supabase
      .from('installments')
      .select('*')
      .eq('context', context)
      .order('due_date', { ascending: true })

    if (error) {
      toast.error('Erro ao carregar faturas')
    } else {
      setInstallments(data || [])
    }
    setLoading(false)
  }

  async function togglePaid(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'paid' ? 'pending' : 'paid'
    const { error } = await supabase
      .from('installments')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) toast.error('Erro ao atualizar')
    else {
      toast.success(newStatus === 'paid' ? 'Parcela quitada!' : 'Status resetado')
      fetchInstallments()
    }
  }

  const getStatus = (dueDate: string, status: string) => {
    if (status === 'paid') return { label: 'PAGO', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 }
    const isOverdue = new Date(dueDate) < new Date()
    if (isOverdue) return { label: 'VENCIDO', color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: AlertCircle }
    return { label: 'PENDENTE', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Calendar }
  }

  // Lógica para agrupar por mês
  const groupedInstallments = installments.reduce((acc: any, inst) => {
    const date = new Date(inst.due_date)
    const monthYear = date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
    if (!acc[monthYear]) acc[monthYear] = { items: [], total: 0 }
    acc[monthYear].items.push(inst)
    acc[monthYear].total += Number(inst.amount)
    return acc
  }, {})

  const totalPending = installments
    .filter(i => i.status !== 'paid')
    .reduce((acc, i) => acc + Number(i.amount), 0)

  // Transforma o objeto agrupado em um array e aplica a ordenação nos meses
  const sortedEntries = Object.entries(groupedInstallments).sort((a: any, b: any) => {
    const dateA = new Date(a[1].items[0].due_date).getTime()
    const dateB = new Date(b[1].items[0].due_date).getTime()
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
  })

  // Aplica o filtro de mês selecionado
  const filteredEntries = selectedMonth === 'all' 
    ? sortedEntries 
    : sortedEntries.filter(([month]) => month === selectedMonth)

  // Lista de todos os meses disponíveis para o select
  const availableMonths = sortedEntries.map(([month]) => month)

  return (
    <DashboardShell>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Faturas do Cartão</h1>
            <p className="text-sm sm:text-base text-[#9BA3AF]">Suas parcelas organizadas por período de pagamento.</p>
          </div>
          <div className="bg-[#151924] border border-[#242938] rounded-2xl px-6 py-4 shadow-lg">
            <p className="text-[#9BA3AF] text-xs uppercase font-bold tracking-widest mb-1">Total Devedor</p>
            <p className="text-2xl font-bold text-[#C80313]">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPending)}
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA3AF]" size={18} />
            <Input 
              placeholder="Buscar por descrição..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#151924] border-[#242938] text-white h-12 rounded-xl"
            />
          </div>
          <select 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="h-12 px-4 rounded-md border border-[#242938] bg-[#151924] text-white outline-none focus:border-[#C80313] capitalize"
          >
            <option value="all">Todos os Meses</option>
            {availableMonths.map((month) => (
              <option key={month as string} value={month as string}>{month}</option>
            ))}
          </select>
          <Button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            variant="outline" 
            className="h-12 px-6 border-[#242938] bg-[#151924] text-white hover:bg-[#1a1f2d]"
          >
            <ArrowDownUp className="mr-2" size={16} />
            {sortOrder === 'asc' ? 'Mais Antigos' : 'Mais Recentes'}
          </Button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#9BA3AF]">Carregando faturas...</div>
        ) : Object.keys(groupedInstallments).length === 0 ? (
          <div className="p-24 text-center text-[#9BA3AF] bg-[#151924] rounded-2xl border border-[#242938]">Nenhum parcelamento encontrado.</div>
        ) : (
          <div className="space-y-10">
            {filteredEntries.map(([month, data]: [string, any]) => (
              <div key={month} className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl font-bold text-white capitalize">{month}</h2>
                  <div className="text-sm">
                    <span className="text-[#9BA3AF]">Total do Mês: </span>
                    <span className="text-white font-bold">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(data.total)}
                    </span>
                  </div>
                </div>

                <div className="bg-[#151924] border border-[#242938] rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <tbody className="divide-y divide-[#242938]">
                        {data.items.filter((i: any) => i.description.toLowerCase().includes(searchTerm.toLowerCase())).map((i: any) => {
                          const status = getStatus(i.due_date, i.status)
                          const Icon = status.icon
                          return (
                            <tr key={i.id} className="hover:bg-white/5 transition-colors group">
                              <td className="p-4 w-32 text-sm font-medium text-[#9BA3AF]">
                                {new Date(i.due_date).toLocaleDateString('pt-BR')}
                              </td>
                              <td className="p-4">
                                <p className="text-white font-medium">{i.description}</p>
                                <p className="text-[10px] text-[#C80313] font-bold uppercase tracking-widest mt-0.5">
                                  Parcela {i.installment_number} de {i.total_installments}
                                </p>
                              </td>
                              <td className="p-4 font-bold text-white w-40">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(i.amount)}
                              </td>
                              <td className="p-4 w-40">
                                <div className={cn(
                                  "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold border w-fit",
                                  status.color
                                )}>
                                  <Icon size={12} />
                                  {status.label}
                                </div>
                              </td>
                              <td className="p-4 text-right w-32">
                                <Button 
                                  onClick={() => togglePaid(i.id, i.status)}
                                  size="sm"
                                  className={cn(
                                    "text-[10px] font-bold uppercase rounded-lg px-4 transition-all",
                                    i.status === 'paid' 
                                      ? "bg-[#242938] text-[#9BA3AF] hover:bg-[#2a3042]" 
                                      : "bg-[#C80313] hover:bg-[#E1061B] text-white shadow-lg shadow-[#C80313]/20"
                                  )}
                                >
                                  {i.status === 'paid' ? 'REABRIR' : 'QUITAR'}
                                </Button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  )
}


"use client"

import React, { useEffect, useState } from 'react'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus, Inbox, Search, Filter, ArrowUpCircle, ArrowDownCircle, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { AddTransactionDialog } from '@/components/dashboard/add-transaction-dialog'
import { useFinancial } from '@/lib/context/financial-context'
import { cn } from '@/lib/utils'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { context } = useFinancial()
  const supabase = createClient()

  useEffect(() => {
    fetchTransactions()
  }, [context])

  async function fetchTransactions() {
    setLoading(true)
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('context', context)
      .order('date', { ascending: false })

    if (error) {
      toast.error('Erro ao carregar transações')
    } else {
      setTransactions(data || [])
    }
    setLoading(false)
  }

  async function deleteTransaction(id: string) {
    const { error } = await supabase.from('transactions').delete().eq('id', id)
    if (error) {
      toast.error('Erro ao excluir')
    } else {
      toast.success('Excluído com sucesso')
      fetchTransactions()
    }
  }

  const filteredTransactions = transactions.filter(t => 
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Transações</h1>
            <p className="text-sm sm:text-base text-[#9BA3AF]">
              Gerenciando fluxo: <span className="text-[#C80313] font-bold uppercase">{context}</span>
            </p>
          </div>
          <AddTransactionDialog />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA3AF]" size={18} />
            <Input 
              placeholder="Buscar por descrição..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#151924] border-[#242938] text-white"
            />
          </div>
          <Button variant="outline" className="border-[#242938] text-white">
            <Filter className="mr-2" size={18} /> Filtros
          </Button>
        </div>

        <div className="bg-[#151924] border border-[#242938] rounded-2xl overflow-hidden shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-[#9BA3AF]">Carregando transações...</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 bg-[#0F1117] rounded-full flex items-center justify-center mb-6 border border-[#242938]">
                <Inbox size={32} className="text-[#9BA3AF]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">NADA ENCONTRADO</h3>
              <p className="text-[#9BA3AF]">Nenhuma transação registrada neste contexto.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#242938] bg-[#0F1117]/50">
                    <th className="p-4 text-xs font-bold text-[#9BA3AF] uppercase tracking-wider">Data</th>
                    <th className="p-4 text-xs font-bold text-[#9BA3AF] uppercase tracking-wider">Descrição</th>
                    <th className="p-4 text-xs font-bold text-[#9BA3AF] uppercase tracking-wider">Tipo</th>
                    <th className="p-4 text-xs font-bold text-[#9BA3AF] uppercase tracking-wider">Valor</th>
                    <th className="p-4 text-xs font-bold text-[#9BA3AF] uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#242938]">
                  {filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                      <td className="p-4 text-sm text-[#9BA3AF]">
                        {new Date(t.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4 font-medium text-white">{t.description}</td>
                      <td className="p-4">
                        {t.type === 'income' ? (
                          <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold uppercase">
                            <ArrowUpCircle size={14} /> Receita
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[#C80313] text-xs font-bold uppercase">
                            <ArrowDownCircle size={14} /> Despesa
                          </div>
                        )}
                      </td>
                      <td className={cn(
                        "p-4 font-bold",
                        t.type === 'income' ? "text-emerald-500" : "text-white"
                      )}>
                        {t.type === 'expense' && '- '}
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="text-[#9BA3AF] hover:text-[#C80313] transition-colors p-2"
                        >
                          <Trash2 size={18} />
                        </button>
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

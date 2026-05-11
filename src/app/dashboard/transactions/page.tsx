"use client"

import React from 'react'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Plus, Inbox, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

export function TransactionsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-24 h-24 bg-[#151924] rounded-full flex items-center justify-center mb-6 border border-[#242938]">
        <Inbox size={40} className="text-[#9BA3AF]" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">SEM TRANSAÇÕES AINDA</h3>
      <p className="text-[#9BA3AF] mb-8 max-w-sm">
        Adicione sua primeira transação para começar a visualizar seu fluxo financeiro.
      </p>
      <Button className="bg-[#C80313] hover:bg-[#E1061B] text-white px-8 h-12 rounded-xl shadow-[0_0_20px_rgba(200,3,19,0.3)] transition-all hover:scale-105">
        <Plus className="mr-2" size={20} />
        ADICIONAR TRANSAÇÃO
      </Button>
    </div>
  )
}

export default function TransactionsPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Transactions</h1>
            <p className="text-[#9BA3AF]">Gerencie suas receitas e despesas.</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA3AF]" size={18} />
              <Input 
                placeholder="Filtrar transações..." 
                className="pl-10 bg-[#151924] border-[#242938] text-white w-[300px]"
              />
            </div>
            <Button variant="outline" className="border-[#242938] text-white">
              <Filter className="mr-2" size={18} />
              Filtros
            </Button>
          </div>
        </div>

        <div className="bg-[#151924] border border-[#242938] rounded-2xl p-8 min-h-[500px] flex items-center justify-center">
          <TransactionsEmptyState />
        </div>
      </div>
    </DashboardShell>
  )
}

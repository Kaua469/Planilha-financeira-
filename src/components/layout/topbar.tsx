"use client"

import React from 'react'
import { Search, Bell, User, Building2, UserCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

import { useFinancial } from '@/lib/context/financial-context'

export function ContextSwitcher() {
  const { context, setContext } = useFinancial()

  return (
    <div className="flex items-center bg-[#151924] p-1 rounded-xl border border-[#242938]">
      <button
        onClick={() => setContext('personal')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium",
          context === 'personal' 
            ? "bg-white text-black shadow-lg" 
            : "text-[#9BA3AF] hover:text-white"
        )}
      >
        <UserCircle size={16} />
        Pessoal
      </button>
      <button
        onClick={() => setContext('corporate')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium",
          context === 'corporate' 
            ? "bg-white text-black shadow-lg" 
            : "text-[#9BA3AF] hover:text-white"
        )}
      >
        <Building2 size={16} />
        Kadron
      </button>
    </div>
  )
}

export function Topbar() {
  return (
    <header className="h-[80px] border-b border-[#242938] bg-[#07090D]/80 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-between">
      <div className="flex items-center gap-8 flex-1">
        <h2 className="text-sm font-semibold tracking-widest text-[#9BA3AF] uppercase hidden lg:block">
          KADRON | <span className="text-white">DASHBOARD PERFECT</span>
        </h2>
        
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9BA3AF]" size={18} />
          <Input 
            placeholder="Busca global..." 
            className="pl-10 bg-[#151924] border-[#242938] text-white placeholder:text-[#9BA3AF] rounded-xl focus:border-[#C80313] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <ContextSwitcher />
        
        <button className="relative text-[#9BA3AF] hover:text-white transition-colors">
          <Bell size={22} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#C80313] rounded-full" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer border-2 border-transparent hover:border-[#C80313] transition-all">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#C80313] text-white">KB</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#151924] border-[#242938] text-white">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#242938]" />
            <DropdownMenuItem className="hover:bg-[#C80313]/10 cursor-pointer">Perfil</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-[#C80313]/10 cursor-pointer">Configurações</DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#242938]" />
            <DropdownMenuItem className="text-red-500 hover:bg-red-500/10 cursor-pointer">Sair</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

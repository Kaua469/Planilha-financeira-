"use client"

import React from 'react'
import { Bell, Search, User, Settings, LogOut } from 'lucide-react'
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
import { Button } from '@/components/ui/button'
import { useFinancial } from '@/lib/context/financial-context'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

export function Topbar() {
  const { context, setContext } = useFinancial()
  const supabase = createClient()
  const router = useRouter()
  const [profile, setProfile] = React.useState<any>(null)

  React.useEffect(() => {
    supabase.auth.getUser().then((res: any) => {
      const user = res.data?.user
      if (user) {
        supabase.from('profiles').select('*').eq('id', user.id).single()
          .then((res: any) => setProfile(res.data))
      }
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Até logo!')
    router.push('/login')
  }

  return (
    <header className="h-14 sm:h-16 border-b border-[#242938] bg-[#0F1117]/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left side: spacer for mobile hamburger + context switcher */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Spacer for hamburger button on mobile */}
        <div className="w-10 lg:hidden" />
        
        <div className="bg-[#151924] border border-[#242938] rounded-xl p-1 flex items-center gap-1">
          <Button 
            onClick={() => setContext('personal')}
            variant={context === 'personal' ? 'default' : 'ghost'}
            className={context === 'personal' ? 'bg-[#C80313] hover:bg-[#E1061B] h-7 sm:h-8 text-[10px] sm:text-xs px-2 sm:px-3' : 'h-7 sm:h-8 text-[10px] sm:text-xs text-[#9BA3AF] px-2 sm:px-3'}
          >
            Pessoal
          </Button>
          <Button 
            onClick={() => setContext('corporate')}
            variant={context === 'corporate' ? 'default' : 'ghost'}
            className={context === 'corporate' ? 'bg-[#C80313] hover:bg-[#E1061B] h-7 sm:h-8 text-[10px] sm:text-xs px-2 sm:px-3' : 'h-7 sm:h-8 text-[10px] sm:text-xs text-[#9BA3AF] px-2 sm:px-3'}
          >
            <span className="hidden sm:inline">Corporativo</span>
            <span className="sm:hidden">Corp.</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 text-[#9BA3AF] hover:text-white transition-colors">
              <Bell size={18} className="sm:w-5 sm:h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C80313] rounded-full border-2 border-[#0F1117]" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 sm:w-80 bg-[#151924] border-[#242938] text-white p-4">
            <div className="text-center py-8">
              <Bell className="mx-auto mb-3 text-[#242938]" size={32} />
              <p className="text-sm font-bold">Sem notificações</p>
              <p className="text-xs text-[#9BA3AF] mt-1">Você está em dia com suas finanças!</p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Perfil do Usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer border-2 border-[#242938] hover:border-[#C80313] transition-all w-8 h-8 sm:w-10 sm:h-10">
              <AvatarImage src="" />
              <AvatarFallback className="bg-[#C80313] text-white font-bold text-xs sm:text-sm">
                {profile?.full_name?.substring(0, 2).toUpperCase() || 'KB'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#151924] border-[#242938] text-white">
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">{profile?.full_name || 'Usuário Kadron'}</p>
                <p className="text-xs leading-none text-[#9BA3AF]">{profile?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#242938]" />
            <DropdownMenuItem asChild className="p-3 cursor-pointer focus:bg-[#C80313] focus:text-white transition-colors">
              <Link href="/dashboard/settings" className="flex items-center w-full">
                <User className="mr-2" size={16} />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="p-3 cursor-pointer focus:bg-[#C80313] focus:text-white transition-colors">
              <Link href="/dashboard/settings" className="flex items-center w-full">
                <Settings className="mr-2" size={16} />
                <span>Configurações</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#242938]" />
            <DropdownMenuItem 
              onClick={handleLogout}
              className="p-3 cursor-pointer text-red-500 focus:bg-red-500/10 focus:text-red-500 transition-colors"
            >
              <LogOut className="mr-2" size={16} />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

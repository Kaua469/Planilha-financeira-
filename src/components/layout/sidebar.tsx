"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  Target, 
  FilePieChart, 
  Lightbulb, 
  FileText, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
  CreditCard,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from './logo'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Transações', icon: ArrowLeftRight, href: '/dashboard/transactions' },
  { label: 'Cartão de Crédito', icon: CreditCard, href: '/dashboard/credit-cards' },
  { label: 'Assinaturas', icon: Users, href: '/dashboard/subscriptions' },
  { label: 'Metas', icon: Target, href: '/dashboard/goals' },
  { label: 'Relatórios', icon: FilePieChart, href: '/dashboard/reports' },
  { label: 'Insights', icon: Lightbulb, href: '/dashboard/insights' },
  { label: 'PDFs Financeiros', icon: FileText, href: '/dashboard/pdfs' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  const [mobileOpen, setMobileOpen] = React.useState(false)

  // Close mobile sidebar on route change
  React.useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[#151924] border border-[#242938] rounded-xl text-white hover:bg-[#C80313] transition-colors"
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen bg-[#0F1117] border-r border-[#242938] transition-all duration-300 flex flex-col",
          // Desktop
          "max-lg:z-[80] max-lg:translate-x-[-100%]",
          mobileOpen && "max-lg:translate-x-0",
          // Desktop behavior
          "lg:z-50",
          collapsed ? "lg:w-[80px]" : "lg:w-[260px]",
          // Mobile always full width sidebar
          "max-lg:w-[280px]"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          {(!collapsed || !mobileOpen) && <Logo />}
          {collapsed && !mobileOpen && <div className="w-8 h-8 bg-[#C80313] rounded-lg flex items-center justify-center mx-auto hidden lg:flex">K</div>}
          
          {/* Close button for mobile */}
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-[#9BA3AF] hover:text-white transition-colors"
            aria-label="Fechar menu"
          >
            <X size={22} />
          </button>
        </div>

        <ScrollArea className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                    isActive 
                      ? "bg-[#C80313] text-white shadow-[0_0_15px_rgba(200,3,19,0.3)]" 
                      : "text-[#9BA3AF] hover:text-white hover:bg-[#151924] hover:shadow-[0_0_10px_rgba(200,3,19,0.1)] hover:border-l-2 hover:border-[#C80313]"
                  )}
                >
                  <Icon size={20} className={cn(
                    "transition-colors duration-300",
                    isActive ? "text-white" : "group-hover:text-[#C80313]"
                  )} />
                  {/* Always show labels on mobile, respect collapsed on desktop */}
                  <span className={cn(
                    "font-medium",
                    collapsed ? "lg:hidden" : ""
                  )}>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-[#242938] space-y-2">
          <Link 
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-[#9BA3AF] hover:text-white hover:bg-[#151924] transition-all duration-300",
              pathname === '/dashboard/settings' && "bg-[#151924] text-white"
            )}
          >
            <Settings size={20} />
            <span className={cn(
              "font-medium",
              collapsed ? "lg:hidden" : ""
            )}>Settings</span>
          </Link>
          
          {/* Collapse button only on desktop */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center text-[#9BA3AF] hover:text-[#C80313] hidden lg:flex"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>
      </aside>
    </>
  )
}

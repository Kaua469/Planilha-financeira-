"use client"

import React from 'react'
import { DashboardShell } from "@/components/layout/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Shield, User, Bell, CreditCard } from "lucide-react"

export default function SettingsPage() {
  return (
    <DashboardShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-[#9BA3AF]">Gerencie suas preferências e segurança.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start text-white bg-[#151924] border-l-2 border-[#C80313]">
              <User className="mr-2" size={18} /> Perfil
            </Button>
            <Button variant="ghost" className="w-full justify-start text-[#9BA3AF] hover:text-white">
              <Shield className="mr-2" size={18} /> Segurança
            </Button>
            <Button variant="ghost" className="w-full justify-start text-[#9BA3AF] hover:text-white">
              <Bell className="mr-2" size={18} /> Notificações
            </Button>
            <Button variant="ghost" className="w-full justify-start text-[#9BA3AF] hover:text-white">
              <CreditCard className="mr-2" size={18} /> Assinatura
            </Button>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <Card className="bg-[#151924] border-[#242938]">
              <CardHeader>
                <CardTitle className="text-white">Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20 border-2 border-[#242938]">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-[#C80313] text-2xl">KB</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button size="sm" className="bg-[#C80313] hover:bg-[#E1061B]">Alterar Avatar</Button>
                    <p className="text-xs text-[#9BA3AF]">JPG, GIF ou PNG. Tamanho máximo de 2MB.</p>
                  </div>
                </div>

                <Separator className="bg-[#242938]" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[#F5F7FA]">Nome Completo</Label>
                    <Input defaultValue="Kauã Biscalchini" className="bg-[#0F1117] border-[#242938] text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#F5F7FA]">Email</Label>
                    <Input defaultValue="kauabiscalchini@gmail.com" disabled className="bg-[#0F1117] border-[#242938] text-[#9BA3AF]" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[#F5F7FA]">Cargo</Label>
                    <Input defaultValue="Proprietário" disabled className="bg-[#0F1117] border-[#242938] text-[#9BA3AF]" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-[#C80313] hover:bg-[#E1061B]">Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#151924] border-[#242938] border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-500">Zona de Perigo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#9BA3AF] text-sm mb-6">Uma vez que você excluir sua conta, não há volta. Por favor, tenha certeza.</p>
                <Button variant="destructive" className="bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-500/50">
                  Excluir minha conta
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/layout/logo'
import { cn } from '@/lib/utils'

const steps = [
  {
    id: 1,
    title: "Seja bem-vindo ao Kadron Finance",
    description: "Vamos configurar sua conta em poucos segundos.",
    fields: [
      { name: "income", label: "Qual sua renda mensal média?", type: "number", placeholder: "R$ 5.000,00" },
    ]
  },
  {
    id: 2,
    title: "Seu principal objetivo",
    description: "O que você deseja alcançar com o Kadron Finance?",
    fields: [
      { name: "goal", label: "Qual sua meta principal?", type: "text", placeholder: "Ex: Comprar um carro, Reserva de Emergência" },
      { name: "target", label: "Valor da meta?", type: "number", placeholder: "R$ 50.000,00" },
    ]
  },
  {
    id: 3,
    title: "Contexto de uso",
    description: "Você pretende usar o sistema para fins pessoais ou corporativos?",
    options: [
      { label: "👤 Pessoal", value: "personal" },
      { label: "🏢 Corporativo (Empresarial)", value: "corporate" },
      { label: "🔄 Ambos", value: "both" },
    ]
  }
]

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<any>({
    context: 'personal',
    experience: 'beginner',
    goal: 'organization'
  })
  const router = useRouter()

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/dashboard')
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#07090D] text-white flex flex-col items-center justify-center p-6">
      <Logo className="mb-12" />
      
      <div className="w-full max-w-lg">
        <div className="flex gap-2 mb-8 justify-center">
          {steps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${idx <= currentStep ? "bg-[#C80313]" : "bg-[#242938]"}`} 
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-[#151924] border-[#242938] shadow-2xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-white mb-2">{steps[currentStep].title}</h2>
                <p className="text-[#9BA3AF] mb-8">{steps[currentStep].description}</p>

                <div className="space-y-6">
                  {steps[currentStep].fields?.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <Label className="text-[#F5F7FA]">{field.label}</Label>
                      <Input 
                        type={field.type} 
                        placeholder={field.placeholder}
                        onChange={(e) => setFormData({...formData, [field.name]: e.target.value})}
                        className="bg-[#0F1117] border-[#242938] text-white h-12 focus:border-[#C80313]"
                      />
                    </div>
                  ))}

                  {steps[currentStep].options?.map((option) => {
                    const isSelected = formData.context === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setFormData({...formData, context: option.value})}
                        className={cn(
                          "w-full p-4 rounded-xl border transition-all group text-left",
                          isSelected 
                            ? "border-[#C80313] bg-[#C80313]/10 shadow-[0_0_15px_rgba(200,3,19,0.2)]" 
                            : "border-[#242938] bg-[#0F1117] hover:border-[#C80313]/50"
                        )}
                      >
                        <span className={cn(
                          "text-lg font-medium transition-colors",
                          isSelected ? "text-white" : "text-[#9BA3AF] group-hover:text-white"
                        )}>
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="flex gap-4 mt-12">
                  {currentStep > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={handlePrev}
                      className="flex-1 h-12 border-[#242938] text-white hover:bg-[#0F1117]"
                    >
                      Voltar
                    </Button>
                  )}
                  <Button 
                    onClick={handleNext}
                    className="flex-[2] h-12 bg-[#C80313] hover:bg-[#E1061B] text-white font-bold"
                  >
                    {currentStep === steps.length - 1 ? "Finalizar" : "Próximo"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

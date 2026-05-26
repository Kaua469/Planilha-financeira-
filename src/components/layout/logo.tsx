import React from 'react'

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-bold tracking-tighter ${className}`}>
      <div className="w-8 h-8 bg-[#C80313] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(200,3,19,0.4)]">
        <span className="text-white text-lg">K</span>
      </div>
      <span className="text-xl">KADRON <span className="text-[#C80313]">FINANCE</span></span>
    </div>
  )
}

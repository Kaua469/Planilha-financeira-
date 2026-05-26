"use client"

import React from 'react'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'
import { motion } from 'framer-motion'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07090D] text-[#F5F7FA]">
      <Sidebar />
      {/* On mobile: no left padding. On desktop: respect sidebar width */}
      <div className="lg:pl-[260px] flex flex-col min-h-screen">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}

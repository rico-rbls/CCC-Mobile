'use client'

import { motion } from 'framer-motion'
import { ScanLine, Zap, X } from 'lucide-react'
import { useAppStore } from '@/lib/store'

export default function QRScanScreen() {
  const { setCurrentScreen } = useAppStore()

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 items-center justify-center relative">
      {/* Close button */}
      <button
        onClick={() => setCurrentScreen('home')}
        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 z-10"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-white mb-1">Scan QR Code</h2>
        <p className="text-sm text-white/60">Point your camera at the library QR code</p>
      </div>

      {/* Viewfinder */}
      <div className="relative w-64 h-64 mb-8">
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-lib-purple rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-lib-purple rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-lib-purple rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-lib-purple rounded-br-lg" />

        {/* Animated scan line */}
        <motion.div
          animate={{ y: [-100, 100, -100] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-4 right-4 h-0.5 bg-lib-purple shadow-lg shadow-lib-purple/50"
        />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-lib-purple/20 flex items-center justify-center">
            <ScanLine className="w-8 h-8 text-lib-purple" />
          </div>
        </div>

        {/* Purple gradient background */}
        <div className="absolute inset-0 bg-purple-gradient/10 rounded-2xl" />
      </div>

      {/* Instructions */}
      <div className="px-8 text-center">
        <p className="text-sm text-white/50">
          Hold your device steady over the QR code on the book or library kiosk
        </p>
      </div>

      {/* Flash button */}
      <button className="mt-8 p-3 rounded-full bg-white/10 flex items-center justify-center">
        <Zap className="w-5 h-5 text-white" />
      </button>
    </div>
  )
}

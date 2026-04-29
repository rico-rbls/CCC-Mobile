'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ScanLine, Zap, X, CheckCircle2, Clock, BookOpen, UserCheck } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'

type ScanMode = 'attendance' | 'checkout'

interface ScanResult {
  success: boolean
  mode: ScanMode
  timestamp: string
}

export default function QRScanScreen() {
  const { setCurrentScreen } = useAppStore()
  const [mode, setMode] = useState<ScanMode>('attendance')
  const [torchOn, setTorchOn] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)

  const handleClose = useCallback(() => {
    setCurrentScreen('home')
  }, [setCurrentScreen])

  // Auto-simulate scan after entering viewfinder
  useEffect(() => {
    if (scanning || result) return

    const timer = setTimeout(() => {
      setScanning(true)
      // Simulate scanning delay
      setTimeout(() => {
        setScanning(false)
        setResult({
          success: true,
          mode,
          timestamp: new Date().toLocaleString(),
        })
      }, 3000)
    }, 2000)

    return () => clearTimeout(timer)
  }, [scanning, result, mode])

  const handleRetry = () => {
    setResult(null)
    setScanning(false)
  }

  const handleDone = () => {
    setCurrentScreen('home')
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0d1a] items-center relative overflow-hidden">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 backdrop-blur-sm z-10 hover:bg-white/20 transition-colors"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Mode indicator */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-lib-purple/80 backdrop-blur-sm">
          {mode === 'attendance' ? (
            <UserCheck className="w-3.5 h-3.5 text-white" />
          ) : (
            <BookOpen className="w-3.5 h-3.5 text-white" />
          )}
          <span className="text-xs font-medium text-white">
            {mode === 'attendance' ? 'Attendance' : 'Checkout'}
          </span>
        </div>
      </div>

      {/* Title area */}
      <div className="text-center pt-16 pb-6 px-6">
        <h2 className="text-2xl font-bold text-white mb-2">Scan QR Code</h2>
        <p className="text-sm text-white/50 leading-relaxed">
          Point your camera at the QR code for attendance or book checkout
        </p>
      </div>

      {/* Viewfinder */}
      <div className="relative w-64 h-64 my-4">
        {/* Outer glow */}
        <div className="absolute -inset-4 bg-lib-purple/10 rounded-3xl blur-xl" />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-10 h-10 border-t-[3px] border-l-[3px] border-lib-purple rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-10 h-10 border-t-[3px] border-r-[3px] border-lib-purple rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[3px] border-l-[3px] border-lib-purple rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[3px] border-r-[3px] border-lib-purple rounded-br-xl" />

        {/* Inner corner accents */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-lib-purple/40 rounded-tl-sm" />
        <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-lib-purple/40 rounded-tr-sm" />
        <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-lib-purple/40 rounded-bl-sm" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-lib-purple/40 rounded-br-sm" />

        {/* Animated scan line */}
        <motion.div
          animate={{ y: [-110, 110, -110] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-6 right-6 h-[2px] z-10"
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-lib-purple to-transparent" />
          <div className="w-full h-4 bg-gradient-to-r from-transparent via-lib-purple/20 to-transparent blur-sm -mt-2" />
        </motion.div>

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: scanning ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.8, repeat: scanning ? Infinity : 0 }}
            className="w-16 h-16 rounded-full bg-lib-purple/20 flex items-center justify-center backdrop-blur-sm"
          >
            <ScanLine className="w-8 h-8 text-lib-purple dark:text-lib-purple-300" />
          </motion.div>
        </div>

        {/* Semi-transparent background inside viewfinder */}
        <div className="absolute inset-0 bg-white/5 rounded-2xl" />
      </div>

      {/* Scanning status */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex items-center gap-2 mt-2"
          >
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-lib-purple"
            />
            <span className="text-sm text-lib-purple dark:text-lib-purple-300 font-medium">Scanning...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Mode buttons */}
      <div className="w-full px-6 pb-2">
        <div className="flex gap-3">
          <button
            onClick={() => { setMode('attendance'); setResult(null); setScanning(false) }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              mode === 'attendance'
                ? 'bg-lib-purple text-white shadow-lg shadow-lib-purple/30'
                : 'bg-white/10 text-white/60 hover:bg-white/15'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Attendance Check-in
          </button>
          <button
            onClick={() => { setMode('checkout'); setResult(null); setScanning(false) }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
              mode === 'checkout'
                ? 'bg-lib-purple text-white shadow-lg shadow-lib-purple/30'
                : 'bg-white/10 text-white/60 hover:bg-white/15'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Book Checkout
          </button>
        </div>
      </div>

      {/* Flash toggle */}
      <div className="w-full px-6 py-4">
        <button
          onClick={() => setTorchOn(!torchOn)}
          className={`mx-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
            torchOn
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-white/10 text-white/50 border border-white/10 hover:bg-white/15'
          }`}
        >
          <Zap className={`w-4 h-4 ${torchOn ? 'fill-yellow-400' : ''}`} />
          {torchOn ? 'Flash On' : 'Flash Off'}
        </button>
      </div>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white dark:bg-[#1a0e2e] rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl"
            >
              {/* Success icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.4 }}
                >
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </motion.div>
              </motion.div>

              {/* Success message */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl font-bold text-foreground mb-2"
              >
                {result.mode === 'attendance' ? 'Attendance Logged!' : 'Book Scanned!'}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-muted-foreground mb-4"
              >
                {result.mode === 'attendance'
                  ? 'Your library visit has been recorded successfully.'
                  : 'The book has been scanned for checkout.'}
              </motion.p>

              {/* Timestamp */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-6"
              >
                <Clock className="w-3.5 h-3.5" />
                {result.timestamp}
              </motion.div>

              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex gap-3"
              >
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="flex-1 rounded-xl py-5 border-gray-200 dark:border-gray-700"
                >
                  Scan Again
                </Button>
                <Button
                  onClick={handleDone}
                  className="flex-1 rounded-xl py-5 bg-lib-purple hover:bg-lib-purple/90 text-white"
                >
                  Done
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

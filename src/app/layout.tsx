"use client"
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'
import { Suspense } from 'react'

import WalletProvider from '../components/WalletProvider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap', // Optimize font loading
  preload: true,
})

// export const metadata: Metadata = {
//   title: 'AI Agent Payment System - X402 Protocol',
//   description: 'Pay-per-query AI assistant with X402 payment protocol',
// }

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading application...</p>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<LoadingFallback />}>
          <WalletProvider>
            {children}
          </WalletProvider>
        </Suspense>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            // Reduce memory usage by limiting toast queue
            success: { duration: 3000 },
            error: { duration: 5000 },
          }}
          containerStyle={{
            top: 20,
            right: 20,
          }}
          gutter={8}
          reverseOrder={false}
        />
      </body>
    </html>
  )
}
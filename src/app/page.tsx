'use client'

import { useState, useEffect } from 'react'
import { Brain, Zap, Shield, DollarSign } from 'lucide-react'
import { useAccount } from 'wagmi'
import WalletConnect from '../components/WalletConnect'
import CreditBalance from '../components/CreditBalance'
import ChatInterface from '../components/ChatInterface'
import ConversationSidebar from '../components/ConversationSidebar'
import { User } from '../types'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import PricingSection from '@/components/PricingSection'
import FAQSection from '@/components/FAQSection'

export default function Home() {
  const { address, isConnected } = useAccount()
  const [user, setUser] = useState<User | null>(null)
  const [credits, setCredits] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleWalletConnect = async (walletAddress: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/user?walletAddress=${walletAddress}`)
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setCredits(userData.credits)
      } else {
        throw new Error('Failed to fetch user data')
      }
    } catch (error) {
      toast.error('Failed to connect wallet')
      console.error('Wallet connection error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreditsUpdate = async (newCredits: number) => {
    setCredits(newCredits)

    if (address) {
      try {
        await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress: address,
            credits: newCredits,
          }),
        })
      } catch (error) {
        console.error('Failed to update credits:', error)
      }
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      handleWalletConnect(address)
    }
  }, [isConnected, address])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-crypto-500 to-crypto-600 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Agent</h1>
                <p className="text-sm text-gray-600">X402 Payment Protocol</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isConnected && (
                <CreditBalance
                  credits={credits}
                  onCreditsUpdate={handleCreditsUpdate}
                  compact={true}
                />
              )}
              <WalletConnect
                onConnect={handleWalletConnect}
                isConnected={isConnected}
                address={address}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="">
        {!isConnected ? (
          <div className="text-center space-y-8">
            {/* Hero Section */}

            <div className="min-h-screen bg-white">
              {/* Header */}


              {/* Main Content */}
              <main>
                <HeroSection isVisible={isVisible} />
                <FeaturesSection isVisible={isVisible} />
                <TestimonialsSection isVisible={isVisible} />
                <PricingSection isVisible={isVisible} />
                <FAQSection isVisible={isVisible} />
              </main>

              {/* Footer */}
              <footer className="bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold">Brainwave.io</span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Build better landing page fast
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">Product</h4>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">Company</h4>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-4">Resources</h4>
                      <ul className="space-y-2 text-sm text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">DPA</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Terms of service</a></li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
                    <p>© 2024 Brainwave.io. All rights reserved.</p>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        ) : (
          <div className="flex h-[600px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Conversation Sidebar */}
            {user && (
              <ConversationSidebar
                userId={user.id}
                isOpen={sidebarOpen}
                onToggle={() => setSidebarOpen(!sidebarOpen)}
              />
            )}

            {/* Main Chat Area */}
            <div className={`flex-1 ${sidebarOpen && user ? 'lg:ml-0' : ''}`}>
              <ChatInterface
                credits={credits}
                onCreditsUpdate={handleCreditsUpdate}
                walletAddress={address}


              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}

    </div>
  )
}
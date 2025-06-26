'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, AlertCircle, Loader2, Wallet, CreditCard } from 'lucide-react'
import { ChatMessage } from '../types'
import { useBalance } from 'wagmi'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'
import MarkdownRenderer from './MarkdownRenderer'

interface ChatInterfaceProps {
  credits: number
  onCreditsUpdate: (newCredits: number) => void
  walletAddress?: string
}

export default function ChatInterface({ credits, onCreditsUpdate, walletAddress }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome! I\'m your AI assistant powered by X402 payments. Each query costs $0.10. You need to make a payment through the X402 contract to add credits to your account.',
      timestamp: new Date(),
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get ETH balance
  const { data: balance } = useBalance({
    address: walletAddress as `0x${string}`,
  })

  const queryPrice = 0.10
  const ethBalance = balance ? parseFloat(formatEther(balance.value)) : 0

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return
    if (!walletAddress) {
      toast.error('Please connect your wallet first')
      return
    }
    if (credits < queryPrice) {
      toast.error('Insufficient credits. Please make a payment via X402 to add credits.')
      return
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Deduct credits immediately
      onCreditsUpdate(credits - queryPrice)

      // Call AI API
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: inputValue,
          walletAddress,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get AI response')
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.answer,
        timestamp: new Date(),
        cost: queryPrice,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      // Refund credits on error
      onCreditsUpdate(credits)
      toast.error('Failed to get AI response. Please try again.')

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Sorry, I encountered an error processing your request. Your credits have been refunded.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const canSendMessage = walletAddress && credits >= queryPrice && !isLoading

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-crypto-500 to-crypto-600 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold">AI Assistant</h2>
              <p className="text-crypto-100 text-sm">${queryPrice} per query</p>
            </div>
          </div>

          {/* Balance Display */}
          <div className="flex items-center space-x-4 text-white">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">${credits.toFixed(2)} credits</span>
            </div>
            <div className="flex items-center space-x-2">
              <Wallet className="w-4 h-4" />
              <span className="text-sm">{ethBalance.toFixed(4)} ETH</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${message.type === 'user'
                ? 'bg-crypto-500 text-white'
                : message.type === 'system'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'bg-gray-100 text-gray-800'
                }`}
            >
              <div className="flex items-start space-x-2">
                {message.type !== 'user' && (
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${message.type === 'system' ? 'bg-amber-200' : 'bg-gray-300'
                    }`}>
                    {message.type === 'system' ? (
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Bot className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                )}
                <div className="flex-1">
                  {message.type === 'assistant' ? (
                    <div className="text-sm">
                      <MarkdownRenderer content={message.content} />
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <p className={`text-xs ${message.type === 'user' ? 'text-crypto-100' : 'text-gray-500'
                      }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                    {message.cost && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        ${message.cost.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-gray-600 animate-spin" />
                </div>
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-100 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              !walletAddress
                ? "Connect wallet to start chatting..."
                : credits < queryPrice
                  ? "Make X402 payment to add credits..."
                  : "Ask me anything..."
            }
            disabled={!canSendMessage}
            className="flex-1 border border-gray-300 text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-crypto-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!canSendMessage || !inputValue.trim()}
            className="bg-gradient-to-r from-crypto-500 to-crypto-600 hover:from-crypto-600 hover:to-crypto-700 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {!walletAddress ? (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Connect your wallet to start asking questions
          </p>
        ) : credits < queryPrice ? (
          <p className="text-xs text-amber-600 mt-2 text-center">
            💡 You have {ethBalance.toFixed(4)} ETH in your wallet. Click "Add Credits" to convert ETH to credits via X402 payment.
          </p>
        ) : null}
      </div>
    </div>
  )
}
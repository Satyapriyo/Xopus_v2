import { useState, useEffect } from 'react'
import { MessageSquare, Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { useConversationStore } from '../store/conversationStore'
import { formatDistanceToNow } from 'date-fns'

interface ConversationSidebarProps {
    userId: string
    isOpen: boolean
    onToggle: () => void
}

export default function ConversationSidebar({ userId, isOpen, onToggle }: ConversationSidebarProps) {
    const {
        conversations,
        currentConversation,
        isLoading,
        setCurrentConversation,
        loadConversations,
        createConversation,
        deleteConversation
    } = useConversationStore()

    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState('')

    useEffect(() => {
        if (userId) {
            loadConversations(userId)
        }
    }, [userId, loadConversations])

    const handleNewConversation = async () => {
        try {
            const newConv = await createConversation(userId)
            setCurrentConversation(newConv)
        } catch (error) {
            console.error('Failed to create conversation:', error)
        }
    }

    const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm('Are you sure you want to delete this conversation?')) {
            await deleteConversation(convId)
        }
    }

    const startEditing = (conv: any, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingId(conv.id)
        setEditTitle(conv.title)
    }

    const saveEdit = async (convId: string) => {
        // This would require an update function in the store
        // For now, we'll just cancel editing
        setEditingId(null)
        setEditTitle('')
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditTitle('')
    }

    if (!isOpen) {
        return (
            <button
                onClick={onToggle}
                className="fixed top-4 left-4 z-50 bg-white shadow-lg rounded-lg p-2 hover:bg-gray-50 transition-colors"
            >
                <MessageSquare className="w-5 h-5 text-gray-600" />
            </button>
        )
    }

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={onToggle}
            />

            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-lg z-50 flex flex-col lg:relative lg:w-80">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
                        <button
                            onClick={onToggle}
                            className="lg:hidden p-1 hover:bg-gray-100 rounded"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={handleNewConversation}
                        className="mt-3 w-full flex items-center space-x-2 bg-crypto-500 text-white px-3 py-2 rounded-lg hover:bg-crypto-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span>New Conversation</span>
                    </button>
                </div>

                {/* Conversations List */}
                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-crypto-500 mx-auto"></div>
                            <p className="mt-2 text-sm">Loading conversations...</p>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-sm">No conversations yet.</p>
                            <p className="text-xs mt-1">Start a new conversation to begin!</p>
                        </div>
                    ) : (
                        <div className="p-2 space-y-1">
                            {conversations.map((conv) => (
                                <div
                                    key={conv.id}
                                    onClick={() => setCurrentConversation(conv)}
                                    className={`group relative p-3 rounded-lg cursor-pointer transition-colors ${currentConversation?.id === conv.id
                                            ? 'bg-crypto-50 border border-crypto-200'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            {editingId === conv.id ? (
                                                <div className="flex items-center space-x-1">
                                                    <input
                                                        type="text"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        className="flex-1 text-sm font-medium border border-gray-300 rounded px-2 py-1"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') saveEdit(conv.id)
                                                            if (e.key === 'Escape') cancelEdit()
                                                        }}
                                                        autoFocus
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                    <button
                                                        onClick={() => saveEdit(conv.id)}
                                                        className="text-green-600 hover:text-green-700"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <h3 className="text-sm font-medium text-gray-900 truncate">
                                                        {conv.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {formatDistanceToNow(new Date(conv.updated_at), { addSuffix: true })}
                                                    </p>
                                                </>
                                            )}
                                        </div>

                                        {editingId !== conv.id && (
                                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => startEditing(conv, e)}
                                                    className="p-1 text-gray-400 hover:text-gray-600 rounded"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteConversation(conv.id, e)}
                                                    className="p-1 text-gray-400 hover:text-red-600 rounded"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

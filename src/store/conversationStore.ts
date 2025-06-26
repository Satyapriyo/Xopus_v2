import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Message {
  id: string;
  conversation_id: string;
  type: "user" | "assistant" | "system";
  content: string;
  cost?: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

interface ConversationStore {
  // State
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentConversation: (conversation: Conversation | null) => void;
  loadConversations: (userId: string) => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  createConversation: (userId: string) => Promise<Conversation>;
  addMessage: (message: Omit<Message, "id" | "created_at">) => Promise<Message>;
  updateMessage: (
    messageId: string,
    updates: Partial<Message>
  ) => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
  clearError: () => void;
  resetStore: () => void;
}

export const useConversationStore = create<ConversationStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    conversations: [],
    currentConversation: null,
    messages: [],
    isLoading: false,
    error: null,

    // Set current conversation and load its messages
    setCurrentConversation: (conversation) => {
      set({ currentConversation: conversation, messages: [] });
      if (conversation) {
        get().loadMessages(conversation.id);
      }
    }, // Load all conversations for a user
    loadConversations: async (userId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(`/api/conversations?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to load conversations");

        const data = await response.json();
        set({ conversations: data || [], isLoading: false });
      } catch (error: any) {
        console.error("Error loading conversations:", error);
        set({ error: error.message, isLoading: false });
      }
    }, // Load messages for a specific conversation
    loadMessages: async (conversationId: string) => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch(
          `/api/messages?conversationId=${conversationId}`
        );
        if (!response.ok) throw new Error("Failed to load messages");

        const data = await response.json();
        set({ messages: data || [], isLoading: false });
      } catch (error: any) {
        console.error("Error loading messages:", error);
        set({ error: error.message, isLoading: false });
      }
    }, // Create a new conversation
    createConversation: async (userId: string): Promise<Conversation> => {
      set({ error: null });
      try {
        const response = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, title: "New Conversation" }),
        });

        if (!response.ok) throw new Error("Failed to create conversation");

        const newConversation = await response.json();

        // Update conversations list
        set((state) => ({
          conversations: [newConversation, ...state.conversations],
        }));

        return newConversation;
      } catch (error: any) {
        console.error("Error creating conversation:", error);
        set({ error: error.message });
        throw error;
      }
    }, // Add a new message to the current conversation
    addMessage: async (
      messageData: Omit<Message, "id" | "created_at">
    ): Promise<Message> => {
      set({ error: null });
      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId: messageData.conversation_id,
            type: messageData.type,
            content: messageData.content,
            cost: messageData.cost || null,
            metadata: messageData.metadata || {},
          }),
        });

        if (!response.ok) throw new Error("Failed to add message");

        const newMessage = await response.json();

        // Add message to current messages
        set((state) => ({
          messages: [...state.messages, newMessage],
        }));

        // Update conversation's updated_at in local state
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === messageData.conversation_id
              ? { ...conv, updated_at: new Date().toISOString() }
              : conv
          ),
        }));

        return newMessage;
      } catch (error: any) {
        console.error("Error adding message:", error);
        set({ error: error.message });
        throw error;
      }
    }, // Update a message (useful for streaming responses)
    updateMessage: async (messageId: string, updates: Partial<Message>) => {
      set({ error: null });
      try {
        const response = await fetch("/api/messages", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageId, updates }),
        });

        if (!response.ok) throw new Error("Failed to update message");

        // Update message in local state
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          ),
        }));
      } catch (error: any) {
        console.error("Error updating message:", error);
        set({ error: error.message });
      }
    }, // Delete a conversation and all its messages
    deleteConversation: async (conversationId: string) => {
      set({ error: null });
      try {
        const response = await fetch(
          `/api/conversations?conversationId=${conversationId}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) throw new Error("Failed to delete conversation");

        // Update local state
        set((state) => ({
          conversations: state.conversations.filter(
            (conv) => conv.id !== conversationId
          ),
          currentConversation:
            state.currentConversation?.id === conversationId
              ? null
              : state.currentConversation,
          messages:
            state.currentConversation?.id === conversationId
              ? []
              : state.messages,
        }));
      } catch (error: any) {
        console.error("Error deleting conversation:", error);
        set({ error: error.message });
      }
    },

    // Clear error state
    clearError: () => set({ error: null }),

    // Reset store (useful for logout)
    resetStore: () =>
      set({
        conversations: [],
        currentConversation: null,
        messages: [],
        isLoading: false,
        error: null,
      }),
  }))
);

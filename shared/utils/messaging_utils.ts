// Shared Messaging Utility Functions for Mobile and Web

import { Message, Conversation, MessageType } from '../types/messaging';

/**
 * Format timestamp for display
 */
export function formatMessageTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) { // 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else if (diffInMinutes < 10080) { // 7 days
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
}

/**
 * Format timestamp for chat display (more detailed)
 */
export function formatChatTime(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (messageDate.getTime() === today.getTime()) {
    // Today - show time
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } else if (messageDate.getTime() === today.getTime() - 86400000) {
    // Yesterday
    return 'Yesterday';
  } else if (date.getFullYear() === now.getFullYear()) {
    // This year - show month and day
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } else {
    // Different year - show full date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

/**
 * Get conversation display name
 */
export function getConversationDisplayName(
  conversation: Conversation,
  currentUserId: string
): string {
  if (conversation.participants.length === 2) {
    // Direct message - show other participant's name
    const otherParticipant = conversation.participants.find(
      p => p.id !== currentUserId
    );
    return otherParticipant?.name || 'Unknown User';
  } else if (conversation.participants.length > 2) {
    // Group chat - show participant names
    const otherParticipants = conversation.participants
      .filter(p => p.id !== currentUserId)
      .slice(0, 3); // Show first 3 names
    
    const names = otherParticipants.map(p => p.name).join(', ');
    const remaining = conversation.participants.length - otherParticipants.length - 1;
    
    return remaining > 0 ? `${names} and ${remaining} others` : names;
  }
  
  return 'Unknown Conversation';
}

/**
 * Get conversation avatar (for group chats or direct messages)
 */
export function getConversationAvatar(
  conversation: Conversation,
  currentUserId: string
): string | null {
  if (conversation.participants.length === 2) {
    // Direct message - show other participant's avatar
    const otherParticipant = conversation.participants.find(
      p => p.id !== currentUserId
    );
    return otherParticipant?.avatar || null;
  }
  
  // Group chat - could return a group avatar or first participant's avatar
  // For now, return the first participant's avatar
  return conversation.participants[0]?.avatar || null;
}

/**
 * Check if message is from current user
 */
export function isMessageFromCurrentUser(
  message: Message,
  currentUserId: string
): boolean {
  return message.senderId === currentUserId;
}

/**
 * Get message type display name
 */
export function getMessageTypeDisplayName(type: MessageType): string {
  switch (type) {
    case MessageType.text:
      return 'Text';
    case MessageType.image:
      return 'Image';
    case MessageType.file:
      return 'File';
    case MessageType.system:
      return 'System';
    default:
      return 'Unknown';
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file type icon
 */
export function getFileTypeIcon(fileType: string): string {
  const type = fileType.toLowerCase();
  
  if (type.startsWith('image/')) {
    return '🖼️';
  } else if (type.startsWith('video/')) {
    return '🎥';
  } else if (type.startsWith('audio/')) {
    return '🎵';
  } else if (type.includes('pdf')) {
    return '📄';
  } else if (type.includes('word') || type.includes('document')) {
    return '📝';
  } else if (type.includes('excel') || type.includes('spreadsheet')) {
    return '📊';
  } else if (type.includes('zip') || type.includes('rar')) {
    return '📦';
  } else {
    return '📎';
  }
}

/**
 * Validate message content
 */
export function validateMessageContent(content: string): {
  isValid: boolean;
  message?: string;
} {
  if (!content || content.trim().length === 0) {
    return { isValid: false, message: 'Message cannot be empty' };
  }
  
  if (content.length > 10000) {
    return { isValid: false, message: 'Message is too long (max 10,000 characters)' };
  }
  
  return { isValid: true };
}

/**
 * Check if conversation has unread messages
 */
export function hasUnreadMessages(conversation: Conversation): boolean {
  return conversation.unreadCount > 0;
}

/**
 * Get unread count badge text
 */
export function getUnreadCountText(count: number): string {
  if (count === 0) return '';
  if (count > 99) return '99+';
  return count.toString();
}

/**
 * Sort conversations by last message time
 */
export function sortConversationsByLastMessage(
  conversations: Conversation[]
): Conversation[] {
  return [...conversations].sort((a, b) => {
    const aTime = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const bTime = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return bTime - aTime; // Newest first
  });
}

/**
 * Filter conversations by search query
 */
export function filterConversations(
  conversations: Conversation[],
  searchQuery: string,
  currentUserId: string
): Conversation[] {
  if (!searchQuery.trim()) return conversations;
  
  const query = searchQuery.toLowerCase();
  
  return conversations.filter(conversation => {
    const displayName = getConversationDisplayName(conversation, currentUserId);
    const lastMessageContent = conversation.lastMessage?.content || '';
    
    return displayName.toLowerCase().includes(query) ||
           lastMessageContent.toLowerCase().includes(query);
  });
}

/**
 * Get typing indicator text
 */
export function getTypingIndicatorText(
  typingUsers: string[],
  currentUserId: string,
  conversation: Conversation
): string {
  if (typingUsers.length === 0) return '';
  
  const otherTypingUsers = typingUsers.filter(userId => userId !== currentUserId);
  
  if (otherTypingUsers.length === 0) return '';
  
  const typingUserNames = otherTypingUsers
    .map(userId => {
      const user = conversation.participants.find(p => p.id === userId);
      return user?.name || 'Someone';
    })
    .slice(0, 2); // Show max 2 names
  
  if (typingUserNames.length === 1) {
    return `${typingUserNames[0]} is typing...`;
  } else if (typingUserNames.length === 2) {
    return `${typingUserNames.join(' and ')} are typing...`;
  } else {
    const remaining = otherTypingUsers.length - 2;
    return `${typingUserNames.join(', ')} and ${remaining} others are typing...`;
  }
}

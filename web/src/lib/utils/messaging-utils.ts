// Messaging Utility Functions for Web

import { Conversation, Message, Message as MessageType } from '@/types';

export class MessagingUtils {
  /// Format timestamp for display
  static formatMessageTime(timestamp: string | Date): string {
    const timestampDate = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diffInMs = now.getTime() - timestampDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

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
      if (timestampDate.getFullYear() !== now.getFullYear()) {
        return `${this.getMonthName(timestampDate.getMonth())} ${timestampDate.getDate()}, ${timestampDate.getFullYear()}`;
      } else {
        return `${this.getMonthName(timestampDate.getMonth())} ${timestampDate.getDate()}`;
      }
    }
  }

  /// Format timestamp for chat display (more detailed)
  static formatChatTime(timestamp: string | Date): string {
    const timestampDate = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(timestampDate.getFullYear(), timestampDate.getMonth(), timestampDate.getDate());

    if (messageDate.getTime() === today.getTime()) {
      // Today - show time
      const hour = timestampDate.getHours();
      const minute = timestampDate.getMinutes().toString().padStart(2, '0');
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      return `${displayHour}:${minute} ${period}`;
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (messageDate.getTime() === yesterday.getTime()) {
        return 'Yesterday';
      } else if (timestampDate.getFullYear() === now.getFullYear()) {
        // This year - show month and day
        return `${this.getMonthName(timestampDate.getMonth())} ${timestampDate.getDate()}`;
      } else {
        // Different year - show full date
        return `${this.getMonthName(timestampDate.getMonth())} ${timestampDate.getDate()}, ${timestampDate.getFullYear()}`;
      }
    }
  }

  /// Get conversation display name
  static getConversationDisplayName(
    conversation: Conversation,
    currentUserId: string
  ): string {
    if (conversation.participants.length === 2) {
      // Direct message - show other participant's name
      const otherParticipant = conversation.participants.find(
        (p) => p.id !== currentUserId
      );
      return otherParticipant?.fullName || 'Unknown User';
    } else if (conversation.participants.length > 2) {
      // Group chat - show participant names
      const otherParticipants = conversation.participants
        .filter((p) => p.id !== currentUserId)
        .slice(0, 3); // Show first 3 names

      const names = otherParticipants.map((p) => p.fullName).join(', ');
      const remaining = conversation.participants.length - otherParticipants.length - 1;

      return remaining > 0 ? `${names} and ${remaining} others` : names;
    }

    return 'Unknown Conversation';
  }

  /// Get conversation avatar (for group chats or direct messages)
  static getConversationAvatar(
    conversation: Conversation,
    currentUserId: string
  ): string | undefined {
    if (conversation.participants.length === 2) {
      // Direct message - show other participant's avatar
      const otherParticipant = conversation.participants.find(
        (p) => p.id !== currentUserId
      );
      return otherParticipant?.profileImage;
    }

    // Group chat - return first participant's avatar
    return conversation.participants[0]?.profileImage;
  }

  /// Check if message is from current user
  static isMessageFromCurrentUser(message: Message, currentUserId: string): boolean {
    return message.senderId === currentUserId;
  }

  /// Get message type display name
  static getMessageTypeDisplayName(type: Message['type']): string {
    switch (type) {
      case 'text':
        return 'Text';
      case 'image':
        return 'Image';
      case 'file':
        return 'File';
      case 'system':
        return 'System';
      default:
        return 'Unknown';
    }
  }

  /// Format file size for display
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(bytes / k);

    return `${(bytes / k).toFixed(2)} ${sizes[i]}`;
  }

  /// Get file type icon
  static getFileTypeIcon(fileType: string): string {
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

  /// Validate message content
  static validateMessageContent(content: string): { isValid: boolean; message?: string } {
    if (content.trim().length === 0) {
      return { isValid: false, message: 'Message cannot be empty' };
    }

    if (content.length > 10000) {
      return {
        isValid: false,
        message: 'Message is too long (max 10,000 characters)'
      };
    }

    return { isValid: true };
  }

  /// Check if conversation has unread messages
  static hasUnreadMessages(conversation: Conversation): boolean {
    return conversation.unreadCount > 0;
  }

  /// Get unread count badge text
  static getUnreadCountText(count: number): string {
    if (count === 0) return '';
    if (count > 99) return '99+';
    return count.toString();
  }

  /// Sort conversations by last message time
  static sortConversationsByLastMessage(conversations: Conversation[]): Conversation[] {
    const sorted = [...conversations];
    sorted.sort((a, b) => {
      const aTime = a.lastMessage?.timestamp ?? a.updatedAt;
      const bTime = b.lastMessage?.timestamp ?? b.updatedAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime(); // Newest first
    });
    return sorted;
  }

  /// Filter conversations by search query
  static filterConversations(
    conversations: Conversation[],
    searchQuery: string,
    currentUserId: string
  ): Conversation[] {
    if (searchQuery.trim().length === 0) return conversations;

    const query = searchQuery.toLowerCase();

    return conversations.filter((conversation) => {
      const displayName = this.getConversationDisplayName(conversation, currentUserId).toLowerCase();
      const lastMessageContent = (conversation.lastMessage?.content ?? '').toLowerCase();

      return displayName.includes(query) || lastMessageContent.includes(query);
    });
  }

  /// Get typing indicator text
  static getTypingIndicatorText(
    typingUsers: string[],
    currentUserId: string,
    conversation: Conversation
  ): string {
    if (typingUsers.length === 0) return '';

    const otherTypingUsers = typingUsers.filter((userId) => userId !== currentUserId);

    if (otherTypingUsers.length === 0) return '';

    const typingUserNames = otherTypingUsers
      .map((userId) => {
        const user = conversation.participants.find((p) => p.id === userId);
        return user?.fullName || 'Someone';
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

  /// Helper method to get month name
  private static getMonthName(month: number): string {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months[month];
  }

  /// Get all message types
  static getAllMessageTypes(): Array<'text' | 'image' | 'file' | 'system'> {
    return ['text', 'image', 'file', 'system'];
  }

  /// Get message type from string
  static getMessageTypeFromString(typeString: string): 'text' | 'image' | 'file' | 'system' {
    const normalized = typeString.toLowerCase();
    if (normalized === 'text' || normalized === 'image' || normalized === 'file' || normalized === 'system') {
      return normalized;
    }
    return 'text';
  }
}


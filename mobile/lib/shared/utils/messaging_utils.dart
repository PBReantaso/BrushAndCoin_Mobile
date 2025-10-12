// Shared Messaging Utility Functions for Mobile App

import '../types/messaging.dart';

class MessagingUtils {
  /// Format timestamp for display
  static String formatMessageTime(DateTime timestamp) {
    final now = DateTime.now();
    final diffInMinutes = now.difference(timestamp).inMinutes;

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return '${diffInMinutes}m ago';
    } else if (diffInMinutes < 1440) {
      // 24 hours
      final hours = (diffInMinutes / 60).floor();
      return '${hours}h ago';
    } else if (diffInMinutes < 10080) {
      // 7 days
      final days = (diffInMinutes / 1440).floor();
      return '${days}d ago';
    } else {
      if (timestamp.year != now.year) {
        return '${_getMonthName(timestamp.month)} ${timestamp.day}, ${timestamp.year}';
      } else {
        return '${_getMonthName(timestamp.month)} ${timestamp.day}';
      }
    }
  }

  /// Format timestamp for chat display (more detailed)
  static String formatChatTime(DateTime timestamp) {
    final now = DateTime.now();
    final today = DateTime(now.year, now.month, now.day);
    final messageDate =
        DateTime(timestamp.year, timestamp.month, timestamp.day);

    if (messageDate.isAtSameMomentAs(today)) {
      // Today - show time
      final hour = timestamp.hour;
      final minute = timestamp.minute.toString().padLeft(2, '0');
      final period = hour >= 12 ? 'PM' : 'AM';
      final displayHour = hour > 12 ? hour - 12 : (hour == 0 ? 12 : hour);
      return '$displayHour:$minute $period';
    } else if (messageDate
        .isAtSameMomentAs(today.subtract(const Duration(days: 1)))) {
      // Yesterday
      return 'Yesterday';
    } else if (timestamp.year == now.year) {
      // This year - show month and day
      return '${_getMonthName(timestamp.month)} ${timestamp.day}';
    } else {
      // Different year - show full date
      return '${_getMonthName(timestamp.month)} ${timestamp.day}, ${timestamp.year}';
    }
  }

  /// Get conversation display name
  static String getConversationDisplayName(
    Conversation conversation,
    String currentUserId,
  ) {
    if (conversation.participants.length == 2) {
      // Direct message - show other participant's name
      final otherParticipant = conversation.participants
          .where((p) => p.id != currentUserId)
          .firstOrNull;
      return otherParticipant?.name ?? 'Unknown User';
    } else if (conversation.participants.length > 2) {
      // Group chat - show participant names
      final otherParticipants = conversation.participants
          .where((p) => p.id != currentUserId)
          .take(3)
          .toList(); // Show first 3 names

      final names = otherParticipants.map((p) => p.name).join(', ');
      final remaining =
          conversation.participants.length - otherParticipants.length - 1;

      return remaining > 0 ? '$names and $remaining others' : names;
    }

    return 'Unknown Conversation';
  }

  /// Get conversation avatar (for group chats or direct messages)
  static String? getConversationAvatar(
    Conversation conversation,
    String currentUserId,
  ) {
    if (conversation.participants.length == 2) {
      // Direct message - show other participant's avatar
      final otherParticipant = conversation.participants
          .where((p) => p.id != currentUserId)
          .firstOrNull;
      return otherParticipant?.avatar;
    }

    // Group chat - could return a group avatar or first participant's avatar
    // For now, return the first participant's avatar
    return conversation.participants.isNotEmpty
        ? conversation.participants.first.avatar
        : null;
  }

  /// Check if message is from current user
  static bool isMessageFromCurrentUser(
    Message message,
    String currentUserId,
  ) {
    return message.senderId == currentUserId;
  }

  /// Get message type display name
  static String getMessageTypeDisplayName(MessageType type) {
    switch (type) {
      case MessageType.text:
        return 'Text';
      case MessageType.image:
        return 'Image';
      case MessageType.file:
        return 'File';
      case MessageType.system:
        return 'System';
    }
  }

  /// Format file size for display
  static String formatFileSize(int bytes) {
    if (bytes == 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    final i = (bytes / k).floor();

    return '${(bytes / k).toStringAsFixed(2)} ${sizes[i]}';
  }

  /// Get file type icon
  static String getFileTypeIcon(String fileType) {
    final type = fileType.toLowerCase();

    if (type.startsWith('image/')) {
      return '🖼️';
    } else if (type.startsWith('video/')) {
      return '🎥';
    } else if (type.startsWith('audio/')) {
      return '🎵';
    } else if (type.contains('pdf')) {
      return '📄';
    } else if (type.contains('word') || type.contains('document')) {
      return '📝';
    } else if (type.contains('excel') || type.contains('spreadsheet')) {
      return '📊';
    } else if (type.contains('zip') || type.contains('rar')) {
      return '📦';
    } else {
      return '📎';
    }
  }

  /// Validate message content
  static Map<String, dynamic> validateMessageContent(String content) {
    if (content.trim().isEmpty) {
      return {'isValid': false, 'message': 'Message cannot be empty'};
    }

    if (content.length > 10000) {
      return {
        'isValid': false,
        'message': 'Message is too long (max 10,000 characters)'
      };
    }

    return {'isValid': true};
  }

  /// Check if conversation has unread messages
  static bool hasUnreadMessages(Conversation conversation) {
    return conversation.unreadCount > 0;
  }

  /// Get unread count badge text
  static String getUnreadCountText(int count) {
    if (count == 0) return '';
    if (count > 99) return '99+';
    return count.toString();
  }

  /// Sort conversations by last message time
  static List<Conversation> sortConversationsByLastMessage(
    List<Conversation> conversations,
  ) {
    final sortedConversations = List<Conversation>.from(conversations);
    sortedConversations.sort((a, b) {
      final aTime = a.lastMessage?.timestamp ?? a.updatedAt;
      final bTime = b.lastMessage?.timestamp ?? b.updatedAt;
      return bTime.compareTo(aTime); // Newest first
    });
    return sortedConversations;
  }

  /// Filter conversations by search query
  static List<Conversation> filterConversations(
    List<Conversation> conversations,
    String searchQuery,
    String currentUserId,
  ) {
    if (searchQuery.trim().isEmpty) return conversations;

    final query = searchQuery.toLowerCase();

    return conversations.where((conversation) {
      final displayName =
          getConversationDisplayName(conversation, currentUserId).toLowerCase();
      final lastMessageContent =
          (conversation.lastMessage?.content ?? '').toLowerCase();

      return displayName.contains(query) || lastMessageContent.contains(query);
    }).toList();
  }

  /// Get typing indicator text
  static String getTypingIndicatorText(
    List<String> typingUsers,
    String currentUserId,
    Conversation conversation,
  ) {
    if (typingUsers.isEmpty) return '';

    final otherTypingUsers =
        typingUsers.where((userId) => userId != currentUserId).toList();

    if (otherTypingUsers.isEmpty) return '';

    final typingUserNames = otherTypingUsers
        .map((userId) {
          final user = conversation.participants
              .where((p) => p.id == userId)
              .firstOrNull;
          return user?.name ?? 'Someone';
        })
        .take(2) // Show max 2 names
        .toList();

    if (typingUserNames.length == 1) {
      return '${typingUserNames.first} is typing...';
    } else if (typingUserNames.length == 2) {
      return '${typingUserNames.join(' and ')} are typing...';
    } else {
      final remaining = otherTypingUsers.length - 2;
      return '${typingUserNames.join(', ')} and $remaining others are typing...';
    }
  }

  /// Helper method to get month name
  static String _getMonthName(int month) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
    ];
    return months[month - 1];
  }

  /// Get all message types
  static List<MessageType> getAllMessageTypes() {
    return MessageType.values;
  }

  /// Get message type from string
  static MessageType getMessageTypeFromString(String typeString) {
    try {
      return MessageType.values.firstWhere(
        (type) => type.name == typeString.toLowerCase(),
      );
    } catch (e) {
      return MessageType.text;
    }
  }
}

// Shared Messaging Types for Mobile App

// User class is defined inline to avoid circular imports

enum MessageType {
  text,
  image,
  file,
  system,
}

class User {
  final String id;
  final String name;
  final String? avatar;
  final bool isOnline;

  User({
    required this.id,
    required this.name,
    this.avatar,
    this.isOnline = false,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      avatar: json['avatar'],
      isOnline: json['is_online'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'avatar': avatar,
      'is_online': isOnline,
    };
  }
}

class Attachment {
  final String id;
  final String fileName;
  final String fileUrl;
  final String fileType;
  final int fileSize;

  Attachment({
    required this.id,
    required this.fileName,
    required this.fileUrl,
    required this.fileType,
    required this.fileSize,
  });

  factory Attachment.fromJson(Map<String, dynamic> json) {
    return Attachment(
      id: json['id'],
      fileName: json['file_name'],
      fileUrl: json['file_url'],
      fileType: json['file_type'],
      fileSize: json['file_size'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'file_name': fileName,
      'file_url': fileUrl,
      'file_type': fileType,
      'file_size': fileSize,
    };
  }
}

class Message {
  final String id;
  final String conversationId;
  final String senderId;
  final User sender;
  final String content;
  final MessageType type;
  final List<Attachment>? attachments;
  final DateTime timestamp;
  final bool isRead;
  final DateTime? readAt;

  Message({
    required this.id,
    required this.conversationId,
    required this.senderId,
    required this.sender,
    required this.content,
    required this.type,
    this.attachments,
    required this.timestamp,
    required this.isRead,
    this.readAt,
  });

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['id'],
      conversationId: json['conversation_id'],
      senderId: json['sender_id'],
      sender: User.fromJson(json['sender']),
      content: json['content'],
      type: MessageType.values.firstWhere(
        (e) => e.name == json['type'],
        orElse: () => MessageType.text,
      ),
      attachments: json['attachments'] != null
          ? List<Attachment>.from(
              json['attachments'].map((x) => Attachment.fromJson(x)))
          : null,
      timestamp: DateTime.parse(json['timestamp']),
      isRead: json['is_read'] ?? false,
      readAt: json['read_at'] != null ? DateTime.parse(json['read_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'conversation_id': conversationId,
      'sender_id': senderId,
      'sender': sender.toJson(),
      'content': content,
      'type': type.name,
      'attachments': attachments?.map((x) => x.toJson()).toList(),
      'timestamp': timestamp.toIso8601String(),
      'is_read': isRead,
      'read_at': readAt?.toIso8601String(),
    };
  }
}

class Conversation {
  final String id;
  final List<User> participants;
  final Message? lastMessage;
  final int unreadCount;
  final DateTime updatedAt;
  final bool isActive;

  Conversation({
    required this.id,
    required this.participants,
    this.lastMessage,
    required this.unreadCount,
    required this.updatedAt,
    required this.isActive,
  });

  factory Conversation.fromJson(Map<String, dynamic> json) {
    return Conversation(
      id: json['id'],
      participants:
          List<User>.from(json['participants'].map((x) => User.fromJson(x))),
      lastMessage: json['last_message'] != null
          ? Message.fromJson(json['last_message'])
          : null,
      unreadCount: json['unread_count'] ?? 0,
      updatedAt: DateTime.parse(json['updated_at']),
      isActive: json['is_active'] ?? true,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'participants': participants.map((x) => x.toJson()).toList(),
      'last_message': lastMessage?.toJson(),
      'unread_count': unreadCount,
      'updated_at': updatedAt.toIso8601String(),
      'is_active': isActive,
    };
  }
}

class TypingIndicator {
  final String userId;
  final String conversationId;
  final bool isTyping;

  TypingIndicator({
    required this.userId,
    required this.conversationId,
    required this.isTyping,
  });

  factory TypingIndicator.fromJson(Map<String, dynamic> json) {
    return TypingIndicator(
      userId: json['user_id'],
      conversationId: json['conversation_id'],
      isTyping: json['is_typing'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'user_id': userId,
      'conversation_id': conversationId,
      'is_typing': isTyping,
    };
  }
}

// Request/Response classes for API calls
class SendMessageRequest {
  final String conversationId;
  final String content;
  final MessageType type;
  final List<String>? attachmentPaths; // File paths for upload

  SendMessageRequest({
    required this.conversationId,
    required this.content,
    required this.type,
    this.attachmentPaths,
  });

  Map<String, dynamic> toJson() {
    return {
      'conversation_id': conversationId,
      'content': content,
      'type': type.name,
      'attachment_paths': attachmentPaths,
    };
  }
}

class CreateConversationRequest {
  final List<String> participantIds;
  final String? initialMessage;

  CreateConversationRequest({
    required this.participantIds,
    this.initialMessage,
  });

  Map<String, dynamic> toJson() {
    return {
      'participant_ids': participantIds,
      'initial_message': initialMessage,
    };
  }
}
